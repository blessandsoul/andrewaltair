import OpenAI from "openai"
import { NextRequest, NextResponse } from "next/server"

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
})

const INTERPRETATION_SCHOOLS = [
    "იუნგიანური ფსიქოანალიზის",
    "ძველი ქართული სიზმართმეტყველების",
    "არქეტიპული ფსიქოლოგიის",
    "მისტიკური სიმბოლიზმის",
    "შამანური ტრადიციის"
]

const DREAM_FOCUSES = [
    "ქვეცნობიერის მესიჯები",
    "ემოციური დამუშავება",
    "მომავლის ნიშნები",
    "შინაგანი კონფლიქტები",
    "სულიერი განვითარება"
]

export async function POST(request: NextRequest) {
    try {
        const { dream } = await request.json()

        if (!dream) {
            return NextResponse.json({ error: "Dream description is required" }, { status: 400 })
        }

        const school = INTERPRETATION_SCHOOLS[Math.floor(Math.random() * INTERPRETATION_SCHOOLS.length)]
        const focus = DREAM_FOCUSES[Math.floor(Math.random() * DREAM_FOCUSES.length)]

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
    "generalMessage": "პოეტური და შთამაგონებელი ზოგადი ინტერპრეტაცია 4-5 წინადადებით"
}`

        const response = await client.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [
                {
                    role: "system",
                    content: `შენ ხარ ლეგენდარული სიზმრების მკითხავი და ფსიქოანალიტიკოსი. შენ ხედავ ქვეცნობიერის საიდუმლოებებს.

შენი ინტერპრეტაციები:
• ღრმა და მნიშვნელოვანია
• ფსიქოლოგიურად დასაბუთებულია
• პოეტური და ხატოვანია
• ყოველთვის შთამაგონებელი და გამაბედავი
• დაწერილია მშვენიერი ქართულით

აბრუნებ ᲛᲮᲝᲚᲝᲓ სუფთა JSON-ს.`
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.88,
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
