export const dynamic = 'force-dynamic'
import { callGemini } from "@/lib/gemini"
import { NextRequest } from "next/server"
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { AI_CONFIG, TAROT_RULES, parseAIResponse } from "@/lib/mystic-rules"

export async function POST(request: NextRequest) {
    try {
        // 🛡️ CSRF PROTECTION
        const { requireCSRF } = await import('@/lib/csrf');
        const csrfError = requireCSRF(request);
        if (csrfError) return csrfError;

        const { cards, spreadType = 'three' } = await request.json()

        // 🛡️ API VALIDATION & SANITIZATION
        const { sanitizeAIInput, sanitizeAIResponse } = await import('@/lib/prompt-sanitizer');

        if (!cards || !Array.isArray(cards) || cards.length === 0) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Input is required', 400)
        }

        // Sanitize card names
        const safeCards = cards.map(card => sanitizeAIInput(card, { maxLength: 50, allowSpecialChars: false }));

        const spreadPrompt = TAROT_RULES.spreads[spreadType as keyof typeof TAROT_RULES.spreads] || TAROT_RULES.spreads.three

        const prompt = `შენ ხარ უძველესი ტაროს მკითხავი, რომელიც საუკუნეებით დაგროვილ სიბრძნეს ფლობს.

გამოცხადებული კარტები (თანმიმდევრობით): ${safeCards.join(', ')}

${spreadPrompt}

შექმენი ღრმა და მისტიკური ინტერპრეტაცია ქართულ ენაზე.

მოთხოვნები:
• თითოეული კარტის მნიშვნელობა დააკავშირე განლაგებაში მის პოზიციასთან
• გამოიყენე პოეტური და მისტიკური ენა
• ინტერპრეტაცია უნდა იყოს პერსონალური და შთამაგონებელი
• რჩევა უნდა იყოს პრაქტიკული და გამოსადეგი

პასუხი მხოლოდ JSON ფორმატში:
{
    "interpretation": "${TAROT_RULES.outputFormat.interpretation}",
    "advice": "${TAROT_RULES.outputFormat.advice}"
}`

        const rawContent = await callGemini({
            systemPrompt: TAROT_RULES.systemPrompt,
            userMessage: prompt,
            temperature: AI_CONFIG.temperature,
            maxOutputTokens: 1000,
        })

        const safeContent = sanitizeAIResponse(rawContent);

        try {
            const jsonMatch = safeContent.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0])
                return apiSuccess({
                    cards: safeCards,
                    interpretation: sanitizeAIResponse(parsed.interpretation || ''),
                    advice: sanitizeAIResponse(parsed.advice || '')
                })
            }
        } catch {
            // Parsing failed
        }

        return apiSuccess({
            cards,
            interpretation: "კარტები მოგითხრობენ მნიშვნელოვან ისტორიას. წარსული და აწმყო ერთმანეთს უკავშირდება, რათა გზა გაგიხსნას მომავლისკენ.",
            advice: "მიენდე შენს ინტუიციას და გაბედე სწორი ნაბიჯის გადადგმა."
        })

    } catch (error) {
        console.error("Tarot API error:", error)
        return apiError(ERROR_CODES.MYSTIC_FETCH_FAILED, 'Tarot reading failed', 500)
    }
}

