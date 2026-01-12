import OpenAI from "openai"
import { NextRequest, NextResponse } from "next/server"
import { AI_CONFIG, HOROSCOPE_RULES, pickRandom, parseAIResponse } from "@/lib/mystic-rules"
import { protectMysticEndpoint } from "@/lib/mystic-auth"

// Lazy initialization to avoid build-time errors
function getClient() {
    return new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: AI_CONFIG.baseURL,
    })
}

export async function POST(request: NextRequest) {
    try {
        // 🛡️ CSRF PROTECTION
        const { requireCSRF } = await import('@/lib/csrf');
        const csrfError = requireCSRF(request);
        if (csrfError) return csrfError;

        // 🛡️ AUTHENTICATION & RATE LIMITING
        const { user, error } = await protectMysticEndpoint(request, 'horoscope');
        if (error) return error;

        const client = getClient()
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

        const influence = pickRandom(HOROSCOPE_RULES.influences)
        const energy = pickRandom(HOROSCOPE_RULES.energies)

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
    "general": "${HOROSCOPE_RULES.outputFormat.general}",
    "love": "${HOROSCOPE_RULES.outputFormat.love}",
    "career": "${HOROSCOPE_RULES.outputFormat.career}",
    "health": "${HOROSCOPE_RULES.outputFormat.health}"
}`

        const response = await client.chat.completions.create({
            model: AI_CONFIG.model,
            messages: [
                {
                    role: "system",
                    content: HOROSCOPE_RULES.systemPrompt
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: AI_CONFIG.temperature,
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
