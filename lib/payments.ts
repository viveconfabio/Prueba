import Stripe from "stripe"

export type CheckoutParams = {
  amount: number // cents
  currency?: string
  reservationId: string
  customerEmail?: string
  successUrl: string
  cancelUrl: string
}

export async function createCheckout(params: CheckoutParams) {
  const provider =
    process.env.PAYMENT_PROVIDER ||
    (process.env.STRIPE_SECRET_KEY ? "stripe" : process.env.PAYPAL_CLIENT_ID ? "paypal" : "none")
  if (provider === "stripe" && process.env.STRIPE_SECRET_KEY) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" as any })
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: params.currency || "usd",
            product_data: { name: "Reservation Deposit" },
            unit_amount: params.amount,
          },
          quantity: 1,
        },
      ],
      customer_email: params.customerEmail,
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: { reservationId: params.reservationId },
    })
    return { provider: "stripe", url: session.url }
  }

  if (provider === "paypal") {
    // Placeholder: Implement PayPal Orders API create and return approval link
    // Use @paypal/checkout-server-sdk in production
    return { provider: "paypal", url: `${params.successUrl}?paypal=demo` }
  }

  throw new Error("No payment provider configured")
}
