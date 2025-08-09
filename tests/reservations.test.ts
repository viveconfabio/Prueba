import { describe, it, expect } from "vitest"
import { POST as createReservation } from "@/app/api/reservations/route"

describe("Reservation API", () => {
  it("validates missing fields", async () => {
    const res = await createReservation(new Request("http://test", { method: "POST", body: JSON.stringify({}) }) as any)
    expect(res.status).toBe(400)
  })
})
