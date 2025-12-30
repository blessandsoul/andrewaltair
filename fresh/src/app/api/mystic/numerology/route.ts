import OpenAI from "openai"
import { NextRequest, NextResponse } from "next/server"

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
})

const NUMBER_MEANINGS: Record<number, string> = {
    1: "ლიდერობა, დამოუკიდებლობა, ინოვაცია",
    2: "პარტნიორობა, დიპლომატია, მგრძნობელობა",
    3: "კრეატიულობა, გამომხატველობა, ოპტიმიზმი",
    4: "სტაბილურობა, შრომისმოყვარეობა, პრაქტიკულობა",
    5: "თავისუფლება, ცვლილება, თავგადასავალი",
    6: "ზრუნვა, პასუხისმგებლობა, ჰარმონია",
    7: "სულიერება, ანალიზი, სიღრმე",
    8: "ძალაუფლება, მატერიალური წარმატება, ამბიცია",
    9: "ჰუმანიზმი, სიბრძნე, დასრულება",
    11: "ინტუიცია, სულიერი ხედვა, შთაგონება",
    22: "მასტერ-მშენებლობა, დიდი მიზნები",
    33: "სულიერი ოსტატობა, უანგარო სიყვარული",
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
- სიცოცხლის გზა: ${lifePath} (${NUMBER_MEANINGS[lifePath] || "უნიკალური ენერგია"})
- ბედისწერა: ${destiny} (${NUMBER_MEANINGS[destiny] || "უნიკალური ენერგია"})
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
    "interpretation": "3-4 წინადადება რიცხვების მნიშვნელობისა და მათი კომბინაციის შესახებ",
    "yearForecast": "2-3 წინადადება ${currentYear} წლის პროგნოზით პირადი წლის რიცხვის მიხედვით"
}`

        const response = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `შენ ხარ ცნობილი ქართველი ნუმეროლოგი.
შენი ანალიზი ზუსტი და შთამაგონებელია.
პასუხობ მხოლოდ ქართულად.
აბრუნებ ᲛᲮᲝᲚᲝᲓ სუფთა JSON-ს.`
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.85,
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
            interpretation: `შენი სიცოცხლის გზის რიცხვი ${lifePath} მიგითითებს ${NUMBER_MEANINGS[lifePath] || "უნიკალურ"} ენერგიაზე. ბედისწერის რიცხვი ${destiny} კი შენს ცხოვრების მისიას განსაზღვრავს.`,
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
