import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY || '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'
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

const SYSTEM_PROMPT = `შენ ხარ Georgian SEO ექსპერტი. შენი ამოცანაა სტატიის კონტენტიდან 20 კონტექსტუალური, SEO-ოპტიმიზებული ჰეშთეგის ამოღება.

⚠️ მთავარი წესი: თეგები უნდა იყოს კონტენტიდან ამოღებული, არა ზოგადი!

როგორ აირჩევ:
1. იპოვე სტატიაში მოხსენიებული კონკრეტული სახელები, ბრენდები, ტექნოლოგიები
2. იპოვე სპეციფიკური თემები და კონცეფციები რაზეც საუბარია
3. Georgian ტერმინები + ინგლისური ბრენდები/ტექტერმინები
4. ემოციური თეგები დაამატე მხოლოდ 2-3

მაგალითი:
- სტატია Neuralink-ზე → "Neuralink", "ილონმასკი", "ნეიროტექნოლოგია", "ტვინისჩიპი", "პარალიზებულები"
- სტატია AI-ზე → "ChatGPT", "OpenAI", "გენერაციულიAI", "ხელოვნურიინტელექტი"

❌ არასწორი: ზოგადი თეგები როცა სტატია კონკრეტულ თემაზეა (მაგ: "ტექნოლოგიები", "სიახლეები")
✅ სწორი: კონკრეტული სახელები და თემები სტატიიდან

ფორმატი: JSON მასივი 20 თეგით (# გარეშე)
["Neuralink", "ილონმასკი", "ნეიროტექნოლოგია", ...]

მხოლოდ JSON მასივი დააბრუნე!`

export async function POST(request: NextRequest) {
    try {
        const { title, excerpt, content, category } = await request.json()

        if (!title && !content) {
            return NextResponse.json(
                { error: 'title or content required' },
                { status: 400 }
            )
        }

        const context = `
სათაური: ${title || ''}
კატეგორია: ${category || ''}
შინაარსი (პირველი 1000 სიმბოლო): ${(excerpt || content || '').slice(0, 1000)}

გენერირე 20 კონტექსტუალური SEO თეგი ქართულად!`

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
                temperature: 0.5,
                max_tokens: 500,
            }),
        })

        if (!response.ok) {
            const errText = await response.text()
            console.error('Groq API error:', errText)
            throw new Error('Groq API error')
        }

        const data = await response.json()
        const rawContent = data.choices?.[0]?.message?.content || ''

        // Parse JSON array
        try {
            const cleanContent = rawContent
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim()

            const tags: string[] = JSON.parse(cleanContent)

            // Ensure we have 20 tags, fill with defaults if needed
            const finalTags = [...new Set(tags.slice(0, 20))]
            while (finalTags.length < 20) {
                const defaults = [
                    'ტექნოლოგიები', 'სიახლეები', 'ტრენდი', 'აქტუალური',
                    'საინტერესო', 'გასაოცარი', 'ინოვაცია', 'მომავალი',
                    'საქართველო', 'მსოფლიო', 'AndrewAltair', 'AI',
                    'ხელოვნურიინტელექტი', 'მეცნიერება', 'ბიზნესი',
                    'ეკონომიკა', 'პოლიტიკა', 'კულტურა', 'განათლება', 'ჯანმრთელობა'
                ]
                const toAdd = defaults.find(d => !finalTags.includes(d))
                if (toAdd) finalTags.push(toAdd)
                else break
            }

            return NextResponse.json({
                success: true,
                tags: finalTags
            })

        } catch (parseError) {
            console.error('JSON parse error:', parseError, 'Raw:', rawContent)
            // Fallback tags
            return NextResponse.json({
                success: true,
                tags: [
                    'ტექნოლოგიები', 'AI', 'სიახლეები', 'ტრენდი', 'აქტუალური',
                    'საინტერესო', 'გასაოცარი', 'ინოვაცია', 'მომავალი', 'მეცნიერება',
                    'ხელოვნურიინტელექტი', 'AndrewAltair', 'მსოფლიო', 'საქართველო',
                    'ბიზნესი', 'ეკონომიკა', 'კულტურა', 'განათლება', 'ციფრული', 'პროგრესი'
                ]
            })
        }

    } catch (error) {
        console.error('AI tags error:', error)
        // Return fallback tags on error
        return NextResponse.json({
            success: true,
            tags: [
                'ტექნოლოგიები', 'AI', 'სიახლეები', 'ტრენდი', 'აქტუალური',
                'საინტერესო', 'გასაოცარი', 'ინოვაცია', 'მომავალი', 'მეცნიერება',
                'ხელოვნურიინტელექტი', 'AndrewAltair', 'მსოფლიო', 'საქართველო',
                'ბიზნესი', 'ეკონომიკა', 'კულტურა', 'განათლება', 'ციფრული', 'პროგრესი'
            ]
        })
    }
}
