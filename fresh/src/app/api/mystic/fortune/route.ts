import OpenAI from "openai"
import { NextRequest, NextResponse } from "next/server"

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
})

const MYSTICAL_STYLES = [
    "ძველბერძნული ორაკულის სტილში",
    "კავკასიური მისტიციზმის სულისკვეთებით",
    "აღმოსავლური სიბრძნით",
    "კელტური დრუიდების ტრადიციით",
    "ვარსკვლავთმრიცხველის თვალით"
]

const PREDICTION_THEMES = [
    "პიროვნული ზრდა და თვითგანვითარება",
    "ურთიერთობები და სოციალური კავშირები",
    "კარიერა და წარმატება",
    "სულიერი მოგზაურობა",
    "ახალი შესაძლებლობები და თავგადასავალი"
]

export async function POST(request: NextRequest) {
    try {
        const { name, birthDate } = await request.json()

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 })
        }

        const style = MYSTICAL_STYLES[Math.floor(Math.random() * MYSTICAL_STYLES.length)]
        const theme = PREDICTION_THEMES[Math.floor(Math.random() * PREDICTION_THEMES.length)]
        const currentDate = new Date().toLocaleDateString("ka-GE")

        const prompt = `შენ ხარ უძველესი მისტიკოსი და წინასწარმეტყველი. დღეს არის ${currentDate}.

მომხმარებლის სახელი: "${name}"${birthDate ? `\nდაბადების თარიღი: ${birthDate}` : ""}

შექმენი **უნიკალური** და **პერსონალური** წინასწარმეტყველება ${style}.
ფოკუსირდი თემაზე: ${theme}.

მოთხოვნები:
• წინასწარმეტყველება უნდა იყოს ღრმა, პოეტური და შთამაგონებელი
• გამოიყენე მდიდარი ქართული ლექსიკა და მეტაფორები
• თითოეული პასუხი უნდა იყოს სრულიად განსხვავებული
• არ გაიმეორო კლიშეები

პასუხი მხოლოდ JSON ფორმატში:
{
    "prediction": "3-4 წინადადება, პოეტური და მისტიკური სტილით",
    "luckyColor": "უნიკალური ფერი ქართულად (მაგ: ზურმუხტისფერი, ალისფერი, ფირუზისფერი)",
    "luckyNumber": "რიცხვი 1-99",
    "luckyDay": "კვირის დღე ქართულად"
}`

        const response = await client.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [
                {
                    role: "system",
                    content: `შენ ხარ ლეგენდარული ქართველი მისტიკოსი და მკითხავი. შენი სიტყვები ძალაუფლებით და სიბრძნით არის სავსე. 

შენი პასუხები:
• ყოველთვის უნიკალური და განუმეორებელია
• დაწერილია მშვენიერი, პოეტური ქართულით
• შეიცავს მეტაფორებს და ხატოვან გამოთქმებს
• გრამატიკულად უზადოა

აბრუნებ ᲛᲮᲝᲚᲝᲓ სუფთა JSON-ს, არანაირი დამატებითი ტექსტის გარეშე.`
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.95,
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
