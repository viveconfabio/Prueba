import { suggestAIReply } from "@/lib/ai"

export async function POST(req: Request) {
  try {
    const { context } = await req.json()
    const suggestion = await suggestAIReply(String(context || ""))
    return Response.json({ suggestion })
  } catch (e) {
    return Response.json({ error: "Failed to generate" }, { status: 500 })
  }
}
