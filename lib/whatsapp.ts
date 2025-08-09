// Utilities for WhatsApp Cloud API (Meta)
// For simple "open chat" use wa.me link on client. For automations, use this server util.
export async function sendWhatsAppMessage({
  toPhoneE164,
  text,
}: {
  toPhoneE164: string
  text: string
}) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  if (!token || !phoneNumberId) {
    throw new Error("WhatsApp API not configured")
  }

  const res = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: toPhoneE164.replace("+", ""),
      type: "text",
      text: { body: text },
    }),
  })
  if (!res.ok) {
    const msg = await res.text()
    throw new Error(`WhatsApp API error: ${msg}`)
  }
  return res.json()
}
