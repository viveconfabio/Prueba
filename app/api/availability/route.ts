import { prisma } from "@/lib/prisma"
import { z } from "zod"

const QuerySchema = z.object({
  restaurantId: z.string(),
  date: z.string(), // ISO date
  partySize: z.number().int().min(1).max(20),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { restaurantId, date, partySize } = QuerySchema.parse(body)
    const d = new Date(date)
    const day = d.getUTCDay()

    // Load rules
    const rules = await prisma.availabilityRule.findMany({ where: { restaurantId, dayOfWeek: day, isOpen: true } })
    if (rules.length === 0) return Response.json({ slots: [] })

    // naive slots builder based on open-close and interval
    const slots: string[] = []
    for (const rule of rules) {
      const [openH, openM] = rule.openTime.split(":").map(Number)
      const [closeH, closeM] = rule.closeTime.split(":").map(Number)
      const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), openH, openM))
      const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), closeH, closeM))
      for (let t = start.getTime(); t + rule.intervalMin * 60000 <= end.getTime(); t += rule.intervalMin * 60000) {
        slots.push(new Date(t).toISOString())
      }
    }

    // Basic capacity check: ensure at least one active table with enough capacity is free at slot
    const tables = await prisma.table.findMany({
      where: { restaurantId, isActive: true, capacity: { gte: partySize } },
    })
    const reservations = await prisma.reservation.findMany({
      where: {
        restaurantId,
        startTime: {
          gte: new Date(d.toISOString().slice(0, 10)),
          lt: new Date(new Date(d).getTime() + 24 * 60 * 60 * 1000),
        },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      select: { startTime: true, endTime: true, tableId: true },
    })

    function isFree(slotIso: string) {
      const slotStart = new Date(slotIso)
      const slotEnd = new Date(slotStart.getTime() + 90 * 60000) // assume 90 min seating
      // check if any table remains free
      for (const table of tables) {
        const conflicts = reservations.some((r) => {
          if (r.tableId !== table.id) return false
          const aStart = r.startTime.getTime()
          const aEnd = r.endTime.getTime()
          return aStart < slotEnd.getTime() && slotStart.getTime() < aEnd // overlap
        })
        if (!conflicts) return true
      }
      return tables.length > 0 && reservations.length === 0
    }

    const available = slots.filter(isFree)

    return Response.json({ slots: available })
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 400 })
  }
}
