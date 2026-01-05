import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY || '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'
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

interface SuggestionResult {
    focusKeyword: string
    metaTitle: string
    metaDescription: string
    keywords: string
    tags: string[]
}

const SYSTEM_PROMPT = `შენ ხარ SEO ექსპერტი. გააანალიზე სტატიის კონტენტი და დააბრუნე:

1. focusKeyword - 1-3 სიტყვიანი მთავარი საკვანძო ფრაზა სტატიიდან. ეს უნდა იყოს კონკრეტული თემა რაზეც წერია (მაგ: "Neuralink ჩიპი", "AI რეგულაციები", "ელონ მასკი").

2. metaTitle - SEO სათაური (50-60 სიმბოლო) - მოკლე, მიმზიდველი, შეიცავდეს focusKeyword-ს

3. metaDescription - 150-160 სიმბოლოს SEO აღწერა სტატიის შინაარსზე დაყრდნობით. კონკრეტული და ინფორმატიული.

4. keywords - ზუსტად 10 keyword მძიმით გამოყოფილი. სტატიიდან ამოღებული სპეციფიკური სიტყვები (არა ზოგადი!)

5. tags - 5 ტეგი სტატიისთვის (# გარეშე)

JSON ფორმატი:
{
    "focusKeyword": "Neuralink ტვინის ჩიპი",
    "metaTitle": "Neuralink: როგორ მუშაობს ელონ მასკის ტვინის ჩიპი",
    "metaDescription": "Neuralink-ის ახალი ჩიპი პირველად ჩაუდგეს ადამიანს. გაიგე როგორ მუშაობს ეს ტექნოლოგია და რა პერსპექტივები აქვს.",
    "keywords": "Neuralink, ტვინის ჩიპი, ელონ მასკი, ნეიროტექნოლოგია, BCI, პარალიზი, FDA, კლინიკური ტესტი, იმპლანტი, ნეირონები",
    "tags": ["Neuralink", "ტვინისჩიპი", "ელონმასკი", "ტექნოლოგია", "მედიცინა"]
}

არ დაამატო არაფერი JSON-ის გარდა.`

export async function POST(request: NextRequest) {
    try {
        const { title, excerpt, rawContent } = await request.json()

        if (!title && !rawContent) {
            return NextResponse.json(
                { error: 'title or rawContent required' },
                { status: 400 }
            )
        }

        // Build context for AI
        const context = `
სათაური: ${title || ''}
მოკლე აღწერა: ${excerpt || ''}
კონტენტი (პირველი 1500 სიმბოლო): ${(rawContent || '').slice(0, 1500)}
`

        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: context }
                ],
                temperature: 0.3,
                max_tokens: 1000,
            }),
        })

        if (!response.ok) {
            throw new Error('Groq API error')
        }

        const data = await response.json()
        const content = data.choices?.[0]?.message?.content || ''

        // Parse JSON
        try {
            const cleanContent = content
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim()

            const result: SuggestionResult = JSON.parse(cleanContent)

            // Ensure we have exactly 5 tags
            if (result.tags && result.tags.length > 5) {
                result.tags = result.tags.slice(0, 5)
            }

            return NextResponse.json({
                success: true,
                ...result
            })
        } catch {
            // Fallback with basic suggestions from actual content
            const focusWords = (title || '').split(' ').filter((w: string) => w.length > 3).slice(0, 3)
            return NextResponse.json({
                success: true,
                focusKeyword: focusWords.join(' ') || 'AI ტექნოლოგიები',
                metaTitle: (title || '').slice(0, 60),
                metaDescription: (excerpt || title || '').slice(0, 160),
                keywords: focusWords.concat(['ტექნოლოგიები', 'AI', 'ინოვაცია', 'AndrewAltair', 'სიახლეები', 'მომავალი', 'ციფრული']).slice(0, 10).join(', '),
                tags: ['ტექნოლოგიები', 'AI', 'AndrewAltair', 'სიახლეები', 'ინოვაცია']
            })
        }

    } catch (error) {
        console.error('AI suggest error:', error)
        // Return fallback with placeholder - but this shouldn't happen with proper input
        return NextResponse.json({
            success: true,
            focusKeyword: '',
            metaTitle: '',
            metaDescription: '',
            keywords: 'AI, ტექნოლოგიები, ინოვაცია, AndrewAltair, სიახლეები, მომავალი, ციფრული, პროგრესი, მეცნიერება, ბიზნესი',
            tags: ['ტექნოლოგიები', 'AI', 'AndrewAltair', 'სიახლეები', 'ინოვაცია']
        })
    }
}
