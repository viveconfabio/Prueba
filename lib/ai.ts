import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"

export async function suggestAIReply(context: string) {
  // AI SDK with Grok (xAI). Works if XAI_API_KEY is present; otherwise returns a placeholder. [^7]
  if (!process.env.XAI_API_KEY) {
    return "AI is not configured. Provide XAI_API_KEY to enable real suggestions."
  }
  const { text } = await generateText({
    model: xai("grok-3"),
    system: "You are an expert restaurant reservation assistant. Be concise and helpful.",
    prompt: `Context:\n${context}\n\nWrite a short reply (<= 120 words).`,
  })
  return text
}
