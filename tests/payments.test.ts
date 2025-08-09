import { describe, it, expect } from "vitest"
import { POST as checkout } from "@/app/api/payments/checkout/route"

describe("Payments", () => {
  it("fails when no provider configured", async () => {
    const req = new Request("http://test", {
      method: "POST",
      body: JSON.stringify({
        amount: 5000,
        reservationId: "resv_123",
        successUrl: "http://localhost:3000/success",
        cancelUrl: "http://localhost:3000/cancel",
      }),
    })
    const res = await checkout(req as any)
    expect(res.status).toBe(400)
  })
})
