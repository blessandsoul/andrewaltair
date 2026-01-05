import { NextRequest, NextResponse } from 'next/server'

const GROQ_API_KEY = process.env.GROQ_API_KEY || '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'
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

interface ModelSettings {
    model?: string
    temperature?: number
    maxTokens?: number
}

async function callGroq(
    systemPrompt: string,
    userMessage: string,
    settings: ModelSettings = {}
): Promise<string> {
    const {
        model = 'llama-3.3-70b-versatile',
        temperature = 0.7,
        maxTokens = 1500
    } = settings

    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            temperature,
            max_tokens: maxTokens,
        }),
    })

    if (!response.ok) {
        throw new Error('Groq API error')
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || ''
}

export async function POST(request: NextRequest) {
    try {
        const { action, prompt, task, role, context, targetLanguage, modelSettings } = await request.json()
        const settings: ModelSettings = modelSettings || {}


        let result = ''

        switch (action) {
            case 'enhance':
                result = await callGroq(
                    `შენ ხარ ექსპერტი პრომპტ ინჟინერი. შენი ამოცანაა მომხმარებლის პრომპტის გაუმჯობესება.

წესები:
1. შეინარჩუნე იგივე სტრუქტურა და მიზანი
2. დაამატე უფრო კონკრეტული ინსტრუქციები
3. ჩართე მაგალითები სადაც საჩიროა
4. დაამატე სპეციფიკური მოთხოვნები
5. გახადე უფრო აქტიური და პრაქტიკული
6. ყველაფერი უნდა იყოს ქართულ ენაზე (ქართული ენა)
7. დააბრუნე მხოლოდ გაუმჯობესებული პრომპტი, სხვა არაფერი`,
                    `გააუმჯობესე ეს პრომპტი ქართულ ენაზე:\n\n${prompt}`,
                    settings
                )
                break

            case 'suggest-task':
                result = await callGroq(
                    `You are a helpful assistant that suggests specific, actionable tasks.

Based on the user's chosen expert role and context, suggest 3 specific tasks they could ask the AI to help with.

RULES:
1. Make suggestions specific and actionable
2. Each suggestion should be 1-2 sentences
3. Focus on high-value tasks that match the role
4. ALWAYS respond in Georgian language (ქართული)
5. Format as a numbered list`,
                    `Role: ${role}\nContext: ${context || 'No specific context provided'}\n\nSuggest 3 specific tasks for this role in Georgian:`,
                    settings
                )
                break

            case 'improve-task':
                result = await callGroq(
                    `You are an expert at writing clear, specific task descriptions for AI assistants.

RULES:
1. Take the user's vague task and make it more specific
2. Add details about expected output, format, and constraints
3. Keep the original intent
4. Make it actionable
5. ALWAYS respond in Georgian language (ქართული)
6. Return ONLY the improved task description, no explanations`,
                    `Improve this task description and respond in Georgian:\n\n${task}`,
                    settings
                )
                break

            case 'score':
                result = await callGroq(
                    `შენ ხარ პრომპტების ექსპერტი შემფასებელი. გააანალიზე მოცემული პრომპტი და მიაწოდე:
1. ხარისხის ქულა 1-დან 10-მდე
2. მოკლე ფიდბექი რა არის კარგად
3. 2-3 კონკრეტული გაუმჯობესების წინადადება

ფორმატირება JSON-ით (ყველაფერი ქართულ ენაზე):
{
    "score": <რიცხვი 1-10>,
    "feedback": "<პოზიტიური ფიდბექი ქართულად>",
    "suggestions": ["<წინადადება 1 ქართულად>", "<წინადადება 2 ქართულად>", "<წინადადება 3 ქართულად>"]
}

დააბრუნე მხოლოდ ვალიდური JSON, სხვა არაფერი.`,
                    `შეაფასე ეს პრომპტი:\n\n${prompt}`,
                    { ...settings, maxTokens: 500 }
                )
                break

            case 'translate':
                // Translate prompt to target language
                const langNames: Record<string, string> = {
                    en: 'English',
                    ge: 'Georgian',
                    ru: 'Russian'
                }
                const targetLang = langNames[targetLanguage] || 'English'

                result = await callGroq(
                    `You are a professional translator. Translate the following prompt to ${targetLang}.

RULES:
1. Keep the same structure and formatting
2. Preserve technical terms where appropriate
3. Maintain the same tone and style
4. Return ONLY the translated text, nothing else`,
                    `Translate this prompt to ${targetLang}:\n\n${prompt}`,
                    settings
                )
                break

            case 'variations':
                result = await callGroq(
                    `You are a creative prompt engineer. Create 3 different variations of the given prompt.

Each variation should:
1. Keep the same core intent
2. Use different phrasing or approach
3. Potentially focus on different aspects
4. Be equally or more effective

Format as numbered list (1., 2., 3.)
Separate each variation with a blank line.`,
                    `Create 3 variations of this prompt:\n\n${prompt}`,
                    { ...settings, maxTokens: 2000 }
                )
                break

            case 'test':
                result = await callGroq(
                    prompt,
                    `გამარჯობა! გამოიყენე შენი შესაძლებლობები და აჩვენე რა შეგიძლიათ გააკეთოთ. მოაწოდეთ ერთი კონკრეტული მაგალითი თქვენი როლის შესაბამისად პასუხის სახით. პასუხი უნდა იყოს ქართულ ენაზე.`,
                    { ...settings, maxTokens: 2000 }
                )
                break

            default:
                return NextResponse.json(
                    { error: 'Invalid action' },
                    { status: 400 }
                )
        }

        return NextResponse.json({ result })

    } catch (error) {
        console.error('Prompt builder AI error:', error)
        return NextResponse.json(
            { error: 'AI service unavailable' },
            { status: 500 }
        )
    }
}

