import OpenAI from "openai"
import { NextRequest, NextResponse } from "next/server"
import { AI_CONFIG, NUMEROLOGY_RULES, parseAIResponse } from "@/lib/mystic-rules"

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: AI_CONFIG.baseURL,
})

// Функция для получения значения числа из централизованных правил
function getNumberMeaning(num: number): string {
    const meanings = NUMEROLOGY_RULES.meanings as Record<number, string>
    return meanings[num] || "უნიკალური ენერგია"
}

export async function POST(request: NextRequest) {
    try {
        const { fullName, birthDate, lifePath, destiny, soul, personality } = await request.json()

        if (!fullName || !birthDate) {
            return NextResponse.json({ error: "Name and birth date are required" }, { status: 400 })
        }

        const currentYear = new Date().getFullYear()
        const personalYear = ((currentYear % 10) + lifePath) % 9 || 9

        const prompt = `შენ ხარ ნუმეროლოგიის ექსპერტი, რომელსაც საუკუნეოვანი ცოდნა აქვს რიცხვების ენერგიის შესახებ.

მომხმარებლის სახელი: "${fullName}"
დაბადების თარიღი: ${birthDate}

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

        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0])
                return NextResponse.json(parsed)
            }
        } catch {
            // Parsing failed
        }

        return NextResponse.json({
            interpretation: `შენი სიცოცხლის გზის რიცხვი ${lifePath} მიგითითებს ${getNumberMeaning(lifePath)} ენერგიაზე. ბედისწერის რიცხვი ${destiny} კი შენს ცხოვრების მისიას განსაზღვრავს.`,
            yearForecast: `${currentYear} წელი პირადი წელი ${personalYear} გთავაზობს ${personalYear <= 5 ? 'აქტიურ მოქმედებას და ახალ შესაძლებლობებს' : 'რეფლექსიას და სიღრმისეულ განვითარებას'}.`
        })

    } catch (error) {
        console.error("Numerology API error:", error)
        return NextResponse.json(
            { error: "Failed to analyze numerology" },
            { status: 500 }
        )
    }
}
