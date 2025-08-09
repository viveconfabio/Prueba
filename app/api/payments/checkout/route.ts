import { createCheckout } from "@/lib/payments"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = await createCheckout({
      amount: body.amount,
      reservationId: body.reservationId,
      currency: body.currency || "usd",
      customerEmail: body.customerEmail,
      successUrl: body.successUrl,
      cancelUrl: body.cancelUrl,
    })
    return Response.json(result)
  } catch (e: any) {
    return Response.json({ error: e.message || "Checkout failed" }, { status: 400 })
  }
}
