import OpenAI from "openai"
import { NextRequest, NextResponse } from "next/server"

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
})

const ASTROLOGICAL_INFLUENCES = [
    "მთვარის ფაზების გავლენით",
    "პლანეტარული ასპექტების გათვალისწინებით",
    "სტიქიების ენერგიის მიხედვით",
    "ვარსკვლავთა კონსტელაციების შუქზე",
    "კოსმიური რიტმების ჰარმონიაში"
]

const DAY_ENERGIES = [
    "ახალი დასაწყისების ენერგია",
    "შემოქმედებითი ძალა",
    "ტრანსფორმაციის პოტენციალი",
    "სტაბილურობის საფუძვლები",
    "ინტუიციის გაღვიძება"
]

export async function POST(request: NextRequest) {
    try {
        const { sign, signName } = await request.json()

        if (!sign) {
            return NextResponse.json({ error: "Zodiac sign is required" }, { status: 400 })
        }

        const today = new Date().toLocaleDateString("ka-GE", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })

        const influence = ASTROLOGICAL_INFLUENCES[Math.floor(Math.random() * ASTROLOGICAL_INFLUENCES.length)]
        const energy = DAY_ENERGIES[Math.floor(Math.random() * DAY_ENERGIES.length)]

        const prompt = `შენ ხარ გამოცდილი ასტროლოგი და ზოდიაქოს ექსპერტი.

დღეს: ${today}
ზოდიაქოს ნიშანი: ${signName} (${sign})
კოსმიური გავლენა: ${influence}
დღის ენერგია: ${energy}

შექმენი **უნიკალური** დღის ჰოროსკოპი ამ ნიშნისთვის.

მოთხოვნები:
• თითოეული კატეგორია უნდა იყოს განსხვავებული და შინაარსიანი
• გამოიყენე პოეტური და ხატოვანი ენა
• პროგნოზები უნდა იყოს პოზიტიური და მოტივაციური
• აჩვენე დღის სპეციფიკური ასპექტები

პასუხი მხოლოდ JSON ფორმატში:
{
    "general": "შთამაგონებელი ზოგადი პროგნოზი 3 წინადადებით",
    "love": "რომანტიული და თბილი სიყვარულის პროგნოზი 2-3 წინადადებით",
    "career": "მოტივაციური კარიერის პროგნოზი 2-3 წინადადებით",
    "health": "მზრუნველი ჯანმრთელობის პროგნოზი 2 წინადადებით"
}`

        const response = await client.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [
                {
                    role: "system",
                    content: `შენ ხარ ლეგენდარული ქართველი ასტროლოგი. შენ ხედავ ვარსკვლავების ენას და კოსმიურ რიტმებს.

შენი პროგნოზები:
• უნიკალური და განუმეორებელია ყოველ დღე
• პოეტური და ხატოვანია
• ყოველთვის პოზიტიური და შთამაგონებელი
• კონკრეტული და პრაქტიკული რჩევებით
• დაწერილია მშვენიერი ქართულით

აბრუნებ ᲛᲮᲝᲚᲝᲓ სუფთა JSON-ს.`
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.9,
            max_tokens: 900,
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
            general: "დღეს კოსმიური ენერგიები შენს მხარესაა. ინტუიცია განსაკუთრებულად ძლიერია — ენდე შინაგან ხმას.",
            love: "სიყვარულის სფეროში სითბო და ჰარმონია მნათობს. გახსენი გული ახალი შესაძლებლობებისთვის.",
            career: "პროფესიულ ასპარეზზე შენი ძალისხმევა შენიშნული იქნება. დღეს კარგი დროა ამბიციური იდეების წარსადგენად.",
            health: "შენი ენერგია ბალანსშია. მოუსმინე სხეულს და მიეცი დასვენების დრო."
        })

    } catch (error) {
        console.error("Horoscope API error:", error)
        return NextResponse.json(
            { error: "Failed to generate horoscope" },
            { status: 500 }
        )
    }
}
