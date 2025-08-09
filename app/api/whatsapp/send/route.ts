import { sendWhatsAppMessage } from "@/lib/whatsapp"

export async function POST(req: Request) {
  try {
    const { toPhoneE164, text } = await req.json()
    const data = await sendWhatsAppMessage({ toPhoneE164, text })
    return Response.json({ ok: true, data })
  } catch (e: any) {
    return Response.json({ ok: false, error: e.message }, { status: 400 })
  }
}
