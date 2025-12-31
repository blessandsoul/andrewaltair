import OpenAI from "openai"
import { NextRequest, NextResponse } from "next/server"
import { AI_CONFIG, DREAM_RULES, pickRandom, parseAIResponse } from "@/lib/mystic-rules"

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: AI_CONFIG.baseURL,
})

export async function POST(request: NextRequest) {
    try {
        const { dream } = await request.json()

        if (!dream) {
            return NextResponse.json({ error: "Dream description is required" }, { status: 400 })
        }

        const school = pickRandom(DREAM_RULES.schools)
        const focus = pickRandom(DREAM_RULES.focuses)

        const prompt = `შენ ხარ სიზმრების ოსტატი და ფსიქოანალიტიკოსი.

მომხმარებლის სიზმარი:
"${dream}"

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

        const response = await client.chat.completions.create({
            model: AI_CONFIG.model,
            messages: [
                {
                    role: "system",
                    content: DREAM_RULES.systemPrompt
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
                return NextResponse.json(parsed)
            }
        } catch {
            // Parsing failed
        }

        return NextResponse.json({
            symbols: [
                { word: "სიზმარი", meaning: "შენი ქვეცნობიერი მნიშვნელოვან მესიჯს გიგზავნის. ეს არის შენი შინაგანი სიბრძნის ხმა.", category: "სიმბოლო" }
            ],
            generalMessage: "შენი სიზმარი ქვეცნობიერის კარებს ხსნის და შენთან საუბრობს სიმბოლოების ენით. ეს არის მოწვევა შინაგანი მოგზაურობისთვის."
        })

    } catch (error) {
        console.error("Dream API error:", error)
        return NextResponse.json(
            { error: "Failed to interpret dream" },
            { status: 500 }
        )
    }
}
