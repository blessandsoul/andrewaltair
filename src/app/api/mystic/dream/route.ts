export const dynamic = 'force-dynamic'
import { callGemini } from "@/lib/gemini"
import { NextRequest } from "next/server"
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { AI_CONFIG, DREAM_RULES, pickRandom } from "@/lib/mystic-rules"
import { getUserFromRequest } from "@/lib/server-auth"

// 🛡️ Rate limiting for dream interpretation
const dreamRequests = new Map<string, { count: number; resetAt: number }>();
const MAX_DREAMS_PER_DAY = 10;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours

function checkDreamRateLimit(userId: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const userLimit = dreamRequests.get(userId);

    if (userLimit) {
        if (now < userLimit.resetAt) {
            if (userLimit.count >= MAX_DREAMS_PER_DAY) {
                return { allowed: false, remaining: 0 };
            }
            userLimit.count++;
            return { allowed: true, remaining: MAX_DREAMS_PER_DAY - userLimit.count };
        }
        dreamRequests.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
        return { allowed: true, remaining: MAX_DREAMS_PER_DAY - 1 };
    }

    dreamRequests.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: MAX_DREAMS_PER_DAY - 1 };
}

export async function POST(request: NextRequest) {
    try {
        // 🛡️ CSRF PROTECTION
        const { requireCSRF } = await import('@/lib/csrf');
        const csrfError = requireCSRF(request);
        if (csrfError) return csrfError;

        // 🛡️ AUTHENTICATION REQUIRED
        const user = await getUserFromRequest(request);
        if (!user) {
            return apiError(ERROR_CODES.AUTH_REQUIRED, 'ავტორიზაცია აუცილებელია', 401);
        }

        // 🛡️ RATE LIMITING
        const rateLimit = checkDreamRateLimit(user._id.toString());
        if (!rateLimit.allowed) {
            return apiError(ERROR_CODES.RATE_LIMITED, 'Too many requests', 429);
        }

        const { dream } = await request.json()

        // 🛡️ API VALIDATION & SANITIZATION
        const { validateAIInput, sanitizeAIInput, sanitizeAIResponse } = await import('@/lib/prompt-sanitizer');

        const dreamValidation = validateAIInput(dream, 'სიზმარი', 10, 2000);
        if (!dreamValidation.valid) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Dream description is required', 400);
        }

        const safeDream = sanitizeAIInput(dream, { maxLength: 2000, allowNewlines: true });

        const school = pickRandom(DREAM_RULES.schools)
        const focus = pickRandom(DREAM_RULES.focuses)

        const prompt = `შენ ხარ სიზმრების ოსტატი და ფსიქოანალიტიკოსი.

მომხმარებლის სიზმარი:
"${safeDream}"

ინტერპრეტაციის მიდგომა: ${school} სკოლის პერსპექტივით
ფოკუსი: ${focus}

მოთხოვნები:
• მოძებნე 2-4 ძირითადი სიმბოლო სიზმარში
• თითოეულ სიმბოლოს მიეცი ღრმა, ფსიქოლოგიური ახსნა
• ზოგადი ინტერპრეტაცია უნდა იყოს შთამაგონებელი და გამაბედავი
• გამოიყენე მდიდარი ქართული ლექსიკა

პასუხი მხოლოდ JSON ფორმატში:
{
    "symbols": [
        {"word": "სიმბოლო", "meaning": "ღრმა ფსიქოლოგიური ახსნა 2 წინადადებით", "category": "ბუნება/მოქმედება/ცხოველი/ადგილი/სიმბოლო/ადამიანი"}
    ],
    "generalMessage": "${DREAM_RULES.outputFormat.generalMessage}"
}`

        const rawContent = await callGemini({
            systemPrompt: DREAM_RULES.systemPrompt,
            userMessage: prompt,
            temperature: AI_CONFIG.temperature,
            maxOutputTokens: 1000,
        })

        const safeContent = sanitizeAIResponse(rawContent);

        try {
            const jsonMatch = safeContent.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0])

                // Sanitize parsed content recursively
                if (parsed.symbols && Array.isArray(parsed.symbols)) {
                    parsed.symbols = parsed.symbols.map((s: any) => ({
                        word: sanitizeAIResponse(s.word || ''),
                        meaning: sanitizeAIResponse(s.meaning || ''),
                        category: sanitizeAIResponse(s.category || '')
                    }));
                }
                parsed.generalMessage = sanitizeAIResponse(parsed.generalMessage || '');

                return apiSuccess(parsed)
            }
        } catch {
            // Parsing failed
        }

        return apiSuccess({
            symbols: [
                { word: "სიზმარი", meaning: "შენი ქვეცნობიერი მნიშვნელოვან მესიჯს გიგზავნის. ეს არის შენი შინაგანი სიბრძნის ხმა.", category: "სიმბოლო" }
            ],
            generalMessage: "შენი სიზმარი ქვეცნობიერის კარებს ხსნის და შენთან საუბრობს სიმბოლოების ენით. ეს არის მოწვევა შინაგანი მოგზაურობისთვის."
        })

    } catch (error) {
        console.error("Dream API error:", error)
        return apiError(ERROR_CODES.MYSTIC_FETCH_FAILED, 'Dream interpretation failed', 500)
    }
}

