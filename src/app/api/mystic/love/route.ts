export const dynamic = 'force-dynamic'
import OpenAI from "openai"
import { NextRequest } from "next/server"
import { apiSuccess, apiError } from '@/lib/api-response'
import { ERROR_CODES } from '@/lib/error-codes'
import { AI_CONFIG, LOVE_RULES, pickRandom, parseAIResponse } from "@/lib/mystic-rules"
import { protectMysticEndpoint, validateInputLength } from "@/lib/mystic-auth"

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
        const { user, error } = await protectMysticEndpoint(request, 'love');
        if (error) return error;

        const client = getClient()
        const { name1, name2 } = await request.json()

        if (!name1 || !name2) {
            return apiError(ERROR_CODES.VALIDATION_FAILED, 'Both names are required', 400)
        }

        // 🛡️ Validate input lengths
        const error1 = validateInputLength(name1, 'პირველი სახელი', 2, 50);
        if (error1) return error1;
        const error2 = validateInputLength(name2, 'მეორე სახელი', 2, 50);
        if (error2) return error2;

        const archetype = pickRandom(LOVE_RULES.archetypes)
        const aspect = pickRandom(LOVE_RULES.aspects)

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
    "title": "${LOVE_RULES.outputFormat.title}",
    "description": "${LOVE_RULES.outputFormat.description}"
}`

        const response = await client.chat.completions.create({
            model: AI_CONFIG.model,
            messages: [
                {
                    role: "system",
                    content: LOVE_RULES.systemPrompt
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: AI_CONFIG.temperature,
            max_tokens: 700,
        })

        const content = response.choices[0]?.message?.content || ""

        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0])
                return apiSuccess(parsed)
            }
        } catch {
            // Parsing failed
        }

        return apiSuccess({
            percentage: 78,
            title: "ვარსკვლავებით დაწერილი კავშირი",
            description: "თქვენს გულებს შორის უჩინარი ძაფი გადაჭიმულია, რომელიც სამყაროს ენერგიებით პულსირებს. ეს კავშირი იშვიათი საჩუქარია ბედისგან."
        })

    } catch (error) {
        console.error("Love API error:", error)
        return apiError(ERROR_CODES.MYSTIC_FETCH_FAILED, 'Love prediction failed', 500)
    }
}

