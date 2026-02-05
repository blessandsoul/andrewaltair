export const dynamic = 'force-dynamic'
import OpenAI from "openai"
import { NextRequest } from "next/server"
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { AI_CONFIG, NUMEROLOGY_RULES, parseAIResponse } from "@/lib/mystic-rules"

// Lazy initialization to avoid build-time errors
function getClient() {
    return new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: AI_CONFIG.baseURL,
    })
}

// Функция для получения значения числа из централизованных правил
function getNumberMeaning(num: number): string {
    const meanings = NUMEROLOGY_RULES.meanings as Record<number, string>
    return meanings[num] || "უნიკალური ენერგია"
}

export async function POST(request: NextRequest) {
    try {
        // 🛡️ CSRF PROTECTION
        const { requireCSRF } = await import('@/lib/csrf');
        const csrfError = requireCSRF(request);
        if (csrfError) return csrfError;

        const client = getClient()
        const { fullName, birthDate, lifePath, destiny, soul, personality } = await request.json()

        // 🛡️ API VALIDATION & SANITIZATION
        const { validateAIInput, sanitizeAIInput, sanitizeAIResponse } = await import('@/lib/prompt-sanitizer');

        const nameValidation = validateAIInput(fullName, 'სახელი', 2, 100);
        if (!nameValidation.valid) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Input is required', 400);
        }

        const safeFullName = sanitizeAIInput(fullName, { maxLength: 100, allowSpecialChars: false });
        const safeBirthDate = sanitizeAIInput(birthDate, { maxLength: 20, allowSpecialChars: false });

        const currentYear = new Date().getFullYear()
        const personalYear = ((currentYear % 10) + lifePath) % 9 || 9

        const prompt = `შენ ხარ ნუმეროლოგიის ექსპერტი, რომელსაც საუკუნეოვანი ცოდნა აქვს რიცხვების ენერგიის შესახებ.

მომხმარებლის სახელი: "${safeFullName}"
დაბადების თარიღი: ${safeBirthDate}

გამოთვლილი რიცხვები:
- სიცოცხლის გზა: ${lifePath} (${getNumberMeaning(lifePath)})
- ბედისწერა: ${destiny} (${getNumberMeaning(destiny)})
- სულის სურვილი: ${soul}
- პიროვნება: ${personality}
- პირადი წელი ${currentYear}: ${personalYear}

შექმენი პერსონალიზებული ნუმეროლოგიური ანალიზი ქართულ ენაზე.

მოთხოვნები:
• ახსენი რიცხვების ურთიერთკავშირი
• გამოიყენე მდიდარი და პოეტური ენა
• იყავი შთამაგონებელი და პოზიტიური
• წლის პროგნოზი უნდა იყოს კონკრეტული

პასუხი მხოლოდ JSON ფორმატში:
{
    "interpretation": "${NUMEROLOGY_RULES.outputFormat.interpretation}",
    "yearForecast": "${NUMEROLOGY_RULES.outputFormat.yearForecast}"
}`

        const response = await client.chat.completions.create({
            model: AI_CONFIG.model,
            messages: [
                {
                    role: "system",
                    content: NUMEROLOGY_RULES.systemPrompt
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: AI_CONFIG.temperature,
            max_tokens: 800,
        })

        const content = response.choices[0]?.message?.content || ""
        const safeContent = sanitizeAIResponse(content);

        try {
            const jsonMatch = safeContent.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0])

                return apiSuccess({
                    interpretation: sanitizeAIResponse(parsed.interpretation || ''),
                    yearForecast: sanitizeAIResponse(parsed.yearForecast || '')
                })
            }
        } catch {
            // Parsing failed
        }

        return apiSuccess({
            interpretation: `შენი სიცოცხლის გზის რიცხვი ${lifePath} მიგითითებს ${getNumberMeaning(lifePath)} ენერგიაზე. ბედისწერის რიცხვი ${destiny} კი შენს ცხოვრების მისიას განსაზღვრავს.`,
            yearForecast: `${currentYear} წელი პირადი წელი ${personalYear} გთავაზობს ${personalYear <= 5 ? 'აქტიურ მოქმედებას და ახალ შესაძლებლობებს' : 'რეფლექსიას და სიღრმისეულ განვითარებას'}.`
        })

    } catch (error) {
        console.error("Numerology API error:", error)
        return apiError(ERROR_CODES.MYSTIC_FETCH_FAILED, 'Numerology prediction failed', 500)
    }
}

