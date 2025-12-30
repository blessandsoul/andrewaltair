import OpenAI from "openai"
import { NextRequest, NextResponse } from "next/server"

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
})

const SPREAD_PROMPTS = {
    three: `სამი კარტის განლაგება:
1. წარსული - რა მოხდა, რა გავლენა მოახდინა
2. აწმყო - სადაც ახლა ხარ, მაღმო სიტუაცია
3. მომავალი - საით მიდიხარ, რა არის ბედისწერა`,
    celtic: `კელტური ჯვრის განლაგება (10 კარტა):
1. აწმყო სიტუაცია
2. გამოწვევა/დაბრკოლება
3. წარსული გავლენა
4. მომავალი შესაძლებლობა
5. შენი მიზანი
6. გარემო ფაქტორები
7. შენი როლი
8. გარე გავლენა
9. იმედები და შიშები
10. საბოლოო შედეგი`
}

export async function POST(request: NextRequest) {
    try {
        const { cards, spreadType = 'three' } = await request.json()

        if (!cards || !Array.isArray(cards) || cards.length === 0) {
            return NextResponse.json({ error: "Cards are required" }, { status: 400 })
        }

        const spreadPrompt = SPREAD_PROMPTS[spreadType as keyof typeof SPREAD_PROMPTS] || SPREAD_PROMPTS.three

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
    "interpretation": "3-5 წინადადება, კარტების ურთიერთკავშირის ღრმა ანალიზი",
    "advice": "1-2 წინადადება, პრაქტიკული რჩევა მომავლისთვის"
}`

        const response = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `შენ ხარ ცნობილი ქართველი ტაროს ოსტატი, რომელსაც საუკუნეოვანი გამოცდილება აქვს.
შენი კითხვები ზუსტი და გამჭრიახია.
პასუხობ მხოლოდ ქართულად, მდიდარი და პოეტური ენით.
აბრუნებ ᲛᲮᲝᲚᲝᲓ სუფთა JSON-ს.`
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.9,
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
