import { sendGmail } from "@/lib/email"

export async function POST(req: Request) {
  try {
    const { to, subject, html } = await req.json()
    const data = await sendGmail({ to, subject, html })
    return Response.json({ ok: true, id: data.id })
  } catch (e: any) {
    return Response.json({ ok: false, error: e.message }, { status: 400 })
  }
}
