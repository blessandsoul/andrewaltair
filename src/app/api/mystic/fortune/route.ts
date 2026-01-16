export const dynamic = 'force-dynamic'
import OpenAI from "openai"
import { NextRequest, NextResponse } from "next/server"
import { AI_CONFIG, FORTUNE_RULES, pickRandom, parseAIResponse } from "@/lib/mystic-rules"
import { protectMysticEndpoint } from "@/lib/mystic-auth"

// Lazy initialization to avoid build-time errors
function getClient() {
    return new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: AI_CONFIG.baseURL,
    })
}

export async function POST(request: NextRequest) {
    try {
        // 🛡️ CSRF PROTECTION
        const { requireCSRF } = await import('@/lib/csrf');
        const csrfError = requireCSRF(request);
        if (csrfError) return csrfError;

        // 🛡️ AUTHENTICATION & RATE LIMITING
        const { user, error } = await protectMysticEndpoint(request, 'fortune');
        if (error) return error;

        const client = getClient()
        const { name, birthDate } = await request.json()

        // 🛡️ Validate input (using new sanitizer lib)
        const { validateAIInput, sanitizeAIInput, sanitizeAIResponse } = await import('@/lib/prompt-sanitizer');

        const nameValidation = validateAIInput(name, 'სახელი', 2, 100);
        if (!nameValidation.valid) {
            return NextResponse.json(
                { error: nameValidation.error },
                { status: 400 }
            );
        }

        // Sanitize inputs
        const safeName = sanitizeAIInput(name, {
            maxLength: 100,
            allowNewlines: false,
            allowSpecialChars: false
        });

        const safeBirthDate = birthDate
            ? sanitizeAIInput(birthDate, { maxLength: 20, allowSpecialChars: false })
            : '';

        const style = pickRandom(FORTUNE_RULES.styles)
        const theme = pickRandom(FORTUNE_RULES.themes)
        const currentDate = new Date().toLocaleDateString("ka-GE")

        const prompt = `შენ ხარ უძველესი მისტიკოსი და წინასწარმეტყველი. დღეს არის ${currentDate}.

მომხმარებლის სახელი: "${safeName}"${safeBirthDate ? `\nდაბადების თარიღი: ${safeBirthDate}` : ""}

შექმენი **უნიკალური** და **პერსონალური** წინასწარმეტყველება ${style}.
ფოკუსირდი თემაზე: ${theme}.

მოთხოვნები:
• წინასწარმეტყველება უნდა იყოს ღრმა, პოეტური და შთამაგონებელი
• გამოიყენე მდიდარი ქართული ლექსიკა და მეტაფორები
• თითოეული პასუხი უნდა იყოს სრულიად განსხვავებული
• არ გაიმეორო კლიშეები

პასუხი მხოლოდ JSON ფორმატში:
{
    "prediction": "${FORTUNE_RULES.outputFormat.prediction}",
    "luckyColor": "${FORTUNE_RULES.outputFormat.luckyColor}",
    "luckyNumber": "${FORTUNE_RULES.outputFormat.luckyNumber}",
    "luckyDay": "${FORTUNE_RULES.outputFormat.luckyDay}"
}`

        const response = await client.chat.completions.create({
            model: AI_CONFIG.model,
            messages: [
                {
                    role: "system",
                    content: FORTUNE_RULES.systemPrompt
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

        // Sanitize AI response
        const safeContent = sanitizeAIResponse(content);

        try {
            const jsonMatch = safeContent.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0])
                return NextResponse.json({
                    prediction: sanitizeAIResponse(parsed.prediction || ''),
                    luckyColor: sanitizeAIResponse(parsed.luckyColor || ''),
                    luckyNumber: sanitizeAIResponse(parsed.luckyNumber || ''),
                    luckyDay: sanitizeAIResponse(parsed.luckyDay || '')
                })
            }
        } catch {
            // If parsing fails, return structured fallback
        }

        return NextResponse.json({
            prediction: "ვარსკვლავთა ქარავანი შენს სახელს ეძებს ცის კამარაზე. დიდი ცვლილებები მოახლოვდა — მზად იყავი მიიღო ბედისწერის საჩუქარი.",
            luckyColor: "ზურმუხტისფერი",
            luckyNumber: "7",
            luckyDay: "პარასკევი"
        })

    } catch (error) {
        console.error("Fortune API error:", error)
        return NextResponse.json(
            { error: "Failed to generate fortune" },
            { status: 500 }
        )
    }
}

