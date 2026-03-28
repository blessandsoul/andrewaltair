import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const GEMINI_MODEL = 'gemini-2.0-flash-lite'

export interface GeminiMessage {
  role: 'user' | 'model'
  parts: Array<{ text: string }>
}

export async function callGemini({
  systemPrompt,
  userMessage,
  temperature = 0.7,
  jsonMode = false,
  maxOutputTokens,
  history = [],
}: {
  systemPrompt: string
  userMessage: string
  temperature?: number
  jsonMode?: boolean
  maxOutputTokens?: number
  history?: GeminiMessage[]
}): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature,
      ...(maxOutputTokens ? { maxOutputTokens } : {}),
      ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
    },
  })

  const chat = model.startChat({ history })
  const result = await chat.sendMessage(userMessage)
  return result.response.text()
}
