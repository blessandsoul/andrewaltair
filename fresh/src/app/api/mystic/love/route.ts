import OpenAI from "openai"
import { NextRequest, NextResponse } from "next/server"
import { AI_CONFIG, LOVE_RULES, pickRandom, parseAIResponse } from "@/lib/mystic-rules"

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: AI_CONFIG.baseURL,
})

export async function POST(request: NextRequest) {
    try {
        const { name1, name2 } = await request.json()

        if (!name1 || !name2) {
            return NextResponse.json({ error: "Both names are required" }, { status: 400 })
        }

        const archetype = pickRandom(LOVE_RULES.archetypes)
        const aspect = pickRandom(LOVE_RULES.aspects)

        const prompt = `შენ ხარ სიყვარულის მისტიკოსი და ურთიერთობების ოსტატი.

გაანალიზე ღრმა კავშირი ამ ორ ადამიანს შორის:
• პირველი: "${name1}"
• მეორე: "${name2}"

ანალიზის მიდგომა: ${archetype}
ფოკუსირდი: ${aspect}

მოთხოვნები:
• შექმენი რომანტიული, პოეტური და უნიკალური აღწერა
• გამოიყენე მეტაფორები და ხატოვანი შედარებები
• პასუხი უნდა იყოს თბილი, პოზიტიური და შთამაგონებელი
• თითოეული წყვილისთვის განსხვავებული პასუხი

პასუხი მხოლოდ JSON ფორმატში:
{
    "percentage": რიცხვი 58-დან 97-მდე,
    "title": "${LOVE_RULES.outputFormat.title}",
    "description": "${LOVE_RULES.outputFormat.description}"
}`

        const response = await client.chat.completions.create({
            model: AI_CONFIG.model,
            messages: [
                {
                    role: "system",
                    content: LOVE_RULES.systemPrompt
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: AI_CONFIG.temperature,
            max_tokens: 700,
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
            percentage: 78,
            title: "ვარსკვლავებით დაწერილი კავშირი",
            description: "თქვენს გულებს შორის უჩინარი ძაფი გადაჭიმულია, რომელიც სამყაროს ენერგიებით პულსირებს. ეს კავშირი იშვიათი საჩუქარია ბედისგან."
        })

    } catch (error) {
        console.error("Love API error:", error)
        return NextResponse.json(
            { error: "Failed to calculate compatibility" },
            { status: 500 }
        )
    }
}
