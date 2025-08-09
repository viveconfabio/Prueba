"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles } from "lucide-react"

export function AIAssistant({
  defaultContext = "Customer asks to move reservation from 7pm to 8pm. Party size 4.",
}: {
  defaultContext?: string
}) {
  const [context, setContext] = useState(defaultContext)
  const [suggestion, setSuggestion] = useState("")
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    setLoading(true)
    setSuggestion("")
    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context }),
      })
      const data = await res.json()
      setSuggestion(data.suggestion || "No suggestion.")
    } catch {
      setSuggestion("Error generating suggestion.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border p-4 space-y-2">
      <div className="font-medium flex items-center gap-2">
        <Sparkles className="h-4 w-4" /> AI Assistant
      </div>
      <Textarea value={context} onChange={(e) => setContext(e.target.value)} rows={4} />
      <div className="flex items-center gap-2">
        <Button onClick={generate} disabled={loading}>
          {loading ? "Thinking..." : "Suggest reply"}
        </Button>
      </div>
      {suggestion && <div className="rounded-md bg-muted p-3 text-sm whitespace-pre-wrap">{suggestion}</div>}
    </div>
  )
}
