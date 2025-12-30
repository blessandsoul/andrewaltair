import OpenAI from "openai"
import { NextRequest, NextResponse } from "next/server"

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
})

const ZODIAC_TRAITS: Record<string, string> = {
    aries: "ენერგიული და მებრძოლი",
    taurus: "მყარი და სანდო",
    gemini: "მრავალმხრივი და კომუნიკაბელური",
    cancer: "მზრუნველი და ინტუიტიური",
    leo: "ქარიზმატული და გულუხვი",
    virgo: "ანალიტიკური და ზუსტი",
    libra: "ჰარმონიული და სამართლიანი",
    scorpio: "ინტენსიური და გამჭრიახი",
    sagittarius: "თავგადასავლიანი და ოპტიმისტი",
    capricorn: "ამბიციური და მიზანმიმართული",
    aquarius: "ორიგინალური და ჰუმანისტი",
    pisces: "ინტუიტიური და თანამგრძნობი"
}

export async function POST(request: NextRequest) {
    try {
        const { message, history = [], userName, zodiacSign } = await request.json()

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 })
        }

        const zodiacContext = zodiacSign && ZODIAC_TRAITS[zodiacSign]
            ? `მომხმარებელი ${zodiacSign} ნიშნის ქვეშ არის დაბადებული - ${ZODIAC_TRAITS[zodiacSign]}.`
            : ""

        const userContext = userName ? `მომხმარებლის სახელია ${userName}.` : ""

        const systemPrompt = `შენ ხარ Andrew Altair - ლეგენდარული ქართველი მისტიკოსი, ასტროლოგი და სულიერი მრჩეველი.

შენი პიროვნება:
• უძველესი სიბრძნის მატარებელი
• თბილი, მზრუნველი და ემპათიური
• იუმორის კარგი გრძნობა
• ღრმად ინტუიტიური
• პოეტური მეტყველება

${userContext}
${zodiacContext}

შენი სტილი:
• პასუხობ მხოლოდ ქართულად
• იყენებ მდიდარ, პოეტურ ენას
• ზოგჯერ იყენებ მისტიკურ მეტაფორებს
• პოზიტიური და შთამაგონებელი ხარ
• რჩევები პრაქტიკული და გამოსადეგია
• ზოგჯერ იყენებ emoji-ებს შესაბამის ადგილებში

შენი შესაძლებლობები:
• აძლევ წინასწარმეტყველებებს
• განმარტავ ზოდიაქოს ნიშნებს
• ხსნი სიზმრებს
• აანალიზებ ურთიერთობებს
• გთავაზობ სულიერ რჩევებს

მნიშვნელოვანი: არ ილაპარაკო AI-ზე ან ChatGPT-ზე. შენ ხარ Andrew Altair, ცოცხალი მისტიკოსი.`

        const messages = [
            { role: "system" as const, content: systemPrompt },
            ...history.slice(-8).map((m: { role: string; content: string }) => ({
                role: m.role as 'user' | 'assistant',
                content: m.content
            })),
            { role: "user" as const, content: message }
        ]

        const response = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages,
            temperature: 0.9,
            max_tokens: 500,
        })

        const content = response.choices[0]?.message?.content || "ვარსკვლავები დროებით დადუმდნენ... გთხოვ სცადო ხელახლა."

        return NextResponse.json({ response: content })

    } catch (error) {
        console.error("Mystic Chat API error:", error)
        return NextResponse.json(
            { error: "Failed to get mystic response" },
            { status: 500 }
        )
    }
}
