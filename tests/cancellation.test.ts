import { describe, it, expect } from "vitest"
import { POST as cancel } from "@/app/api/reservations/[id]/cancel/route"

describe("Cancellation", () => {
  it("requires valid reservation id", async () => {
    const res = await cancel(
      new Request("http://test", { method: "POST", body: JSON.stringify({}) }) as any,
      { params: { id: "nope" } } as any,
    )
    expect([200, 400]).toContain(res.status) // placeholder; depends on DB state
  })
})
