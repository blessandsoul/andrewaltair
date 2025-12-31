import OpenAI from "openai"
import { NextRequest, NextResponse } from "next/server"
import { AI_CONFIG, TAROT_RULES, parseAIResponse } from "@/lib/mystic-rules"

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: AI_CONFIG.baseURL,
})

export async function POST(request: NextRequest) {
    try {
        const { cards, spreadType = 'three' } = await request.json()

        if (!cards || !Array.isArray(cards) || cards.length === 0) {
            return NextResponse.json({ error: "Cards are required" }, { status: 400 })
        }

        const spreadPrompt = TAROT_RULES.spreads[spreadType as keyof typeof TAROT_RULES.spreads] || TAROT_RULES.spreads.three

        const prompt = `შენ ხარ უძველესი ტაროს მკითხავი, რომელიც საუკუნეებით დაგროვილ სიბრძნეს ფლობს.

გამოცხადებული კარტები (თანმიმდევრობით): ${cards.join(', ')}

${spreadPrompt}

შექმენი ღრმა და მისტიკური ინტერპრეტაცია ქართულ ენაზე.

მოთხოვნები:
• თითოეული კარტის მნიშვნელობა დააკავშირე განლაგებაში მის პოზიციასთან
• გამოიყენე პოეტური და მისტიკური ენა
• ინტერპრეტაცია უნდა იყოს პერსონალური და შთამაგონებელი
• რჩევა უნდა იყოს პრაქტიკული და გამოსადეგი

პასუხი მხოლოდ JSON ფორმატში:
{
    "interpretation": "${TAROT_RULES.outputFormat.interpretation}",
    "advice": "${TAROT_RULES.outputFormat.advice}"
}`

        const response = await client.chat.completions.create({
            model: AI_CONFIG.model,
            messages: [
                {
                    role: "system",
                    content: TAROT_RULES.systemPrompt
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: AI_CONFIG.temperature,
            max_tokens: 1000,
        })

        const content = response.choices[0]?.message?.content || ""

        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0])
                return NextResponse.json({
                    cards,
                    interpretation: parsed.interpretation,
                    advice: parsed.advice
                })
            }
        } catch {
            // Parsing failed
        }

        return NextResponse.json({
            cards,
            interpretation: "კარტები მოგითხრობენ მნიშვნელოვან ისტორიას. წარსული და აწმყო ერთმანეთს უკავშირდება, რათა გზა გაგიხსნას მომავლისკენ.",
            advice: "მიენდე შენს ინტუიციას და გაბედე სწორი ნაბიჯის გადადგმა."
        })

    } catch (error) {
        console.error("Tarot API error:", error)
        return NextResponse.json(
            { error: "Failed to interpret tarot" },
            { status: 500 }
        )
    }
}
