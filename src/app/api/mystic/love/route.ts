import OpenAI from "openai"
import { NextRequest, NextResponse } from "next/server"

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
})

const LOVE_ARCHETYPES = [
    "ცეცხლის სტიქიით — ვნებიანი და ინტენსიური",
    "წყლის სტიქიით — ღრმა და ემოციური",
    "ჰაერის სტიქიით — ინტელექტუალური და თავისუფალი",
    "მიწის სტიქიით — სტაბილური და ერთგული",
    "ეთერის სტიქიით — სულიერი და ტრანსცენდენტური"
]

const RELATIONSHIP_ASPECTS = [
    "ემოციური თავსებადობა",
    "ინტელექტუალური კავშირი",
    "ვნების და მიზიდულობის დონე",
    "გრძელვადიანი პერსპექტივა",
    "სულიერი ჰარმონია"
]

export async function POST(request: NextRequest) {
    try {
        const { name1, name2 } = await request.json()

        if (!name1 || !name2) {
            return NextResponse.json({ error: "Both names are required" }, { status: 400 })
        }

        const archetype = LOVE_ARCHETYPES[Math.floor(Math.random() * LOVE_ARCHETYPES.length)]
        const aspect = RELATIONSHIP_ASPECTS[Math.floor(Math.random() * RELATIONSHIP_ASPECTS.length)]

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
    "title": "პოეტური სათაური 3-5 სიტყვით",
    "description": "რომანტიული აღწერა 3-4 წინადადებით, მეტაფორებით და ხატოვანი ენით"
}`

        const response = await client.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [
                {
                    role: "system",
                    content: `შენ ხარ ლეგენდარული ქართველი სიყვარულის მისტიკოსი. შენ ხედავ გულების ფარულ კავშირებს.

შენი პასუხები:
• რომანტიული და პოეტურია
• სავსეა მეტაფორებით და ხატოვანი გამოთქმებით
• ყოველთვის პოზიტიური და შთამაგონებელია
• უნიკალურია თითოეული წყვილისთვის
• დაწერილია მშვენიერი ქართულით

აბრუნებ ᲛᲮᲝᲚᲝᲓ სუფთა JSON-ს.`
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.92,
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
