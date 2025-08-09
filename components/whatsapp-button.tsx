"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

export function WhatsAppButton({
  phone,
  message,
  className,
}: {
  phone: string
  message: string
  className?: string
}) {
  const url = `https://wa.me/${encodeURIComponent(phone)}?text=${encodeURIComponent(message)}`
  return (
    <Button asChild variant="secondary" className={className}>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="mr-2 h-4 w-4" />
        WhatsApp
      </a>
    </Button>
  )
}
