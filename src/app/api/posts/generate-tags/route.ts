export const dynamic = 'force-dynamic'
import { NextRequest } from 'next/server'
import { callGemini } from '@/lib/gemini'
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'

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
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'title or content required', 400)
        }

        const context = `
სათაური: ${title || ''}
კატეგორია: ${category || ''}
შინაარსი (პირველი 1000 სიმბოლო): ${(excerpt || content || '').slice(0, 1000)}

გენერირე 20 კონტექსტუალური SEO თეგი ქართულად!`

        const rawContent = await callGemini({
            systemPrompt: SYSTEM_PROMPT,
            userMessage: context,
            temperature: 0.5,
            maxOutputTokens: 500,
        })

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

            return apiSuccess({ tags: finalTags }, 'Tags generated successfully')

        } catch (parseError) {
            console.error('JSON parse error:', parseError, 'Raw:', rawContent)
            // Fallback tags
            return apiSuccess({
                tags: [
                    'ტექნოლოგიები', 'AI', 'სიახლეები', 'ტრენდი', 'აქტუალური',
                    'საინტერესო', 'გასაოცარი', 'ინოვაცია', 'მომავალი', 'მეცნიერება',
                    'ხელოვნურიინტელექტი', 'AndrewAltair', 'მსოფლიო', 'საქართველო',
                    'ბიზნესი', 'ეკონომიკა', 'კულტურა', 'განათლება', 'ციფრული', 'პროგრესი'
                ]
            }, 'Tags generated with fallback')
        }

    } catch (error) {
        console.error('AI tags error:', error)
        // Return fallback tags on error
        return apiSuccess({
            tags: [
                'ტექნოლოგიები', 'AI', 'სიახლეები', 'ტრენდი', 'აქტუალური',
                'საინტერესო', 'გასაოცარი', 'ინოვაცია', 'მომავალი', 'მეცნიერება',
                'ხელოვნურიინტელექტი', 'AndrewAltair', 'მსოფლიო', 'საქართველო',
                'ბიზნესი', 'ეკონომიკა', 'კულტურა', 'განათლება', 'ციფრული', 'პროგრესი'
            ]
        }, 'Tags generated with fallback')
    }
}

