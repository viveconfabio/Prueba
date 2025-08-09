import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { sendWhatsAppMessage } from "@/lib/whatsapp"
import { sendGmail } from "@/lib/email"

const ReservationSchema = z.object({
  restaurantId: z.string(),
  customer: z.object({
    name: z.string(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  }),
  partySize: z.number().int().min(1),
  startTime: z.string(), // ISO
  durationMin: z.number().int().min(30).max(240).default(90),
  notes: z.string().optional(),
  requireDeposit: z.boolean().optional(),
  depositAmount: z.number().int().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = ReservationSchema.parse(body)
    const startTime = new Date(data.startTime)
    const endTime = new Date(startTime.getTime() + (data.durationMin || 90) * 60000)

    // Upsert customer
    const customer = await prisma.customerProfile.upsert({
      where: { email: data.customer.email ?? `anon_${data.customer.phone}` },
      update: { name: data.customer.name, phone: data.customer.phone || undefined },
      create: {
        name: data.customer.name,
        email: data.customer.email,
        phone: data.customer.phone,
      },
    })

    // Find a free table (simplified)
    const tables = await prisma.table.findMany({
      where: { restaurantId: data.restaurantId, isActive: true, capacity: { gte: data.partySize } },
      orderBy: { capacity: "asc" },
    })

    const table = await (async () => {
      for (const t of tables) {
        const overlap = await prisma.reservation.count({
          where: {
            tableId: t.id,
            status: { in: ["PENDING", "CONFIRMED"] },
            OR: [
              { startTime: { lt: endTime }, endTime: { gt: startTime } }, // overlap
            ],
          },
        })
        if (overlap === 0) return t
      }
      return null
    })()

    if (!table) {
      return Response.json({ error: "No table available" }, { status: 409 })
    }

    const reservation = await prisma.$transaction(async (tx) => {
      const created = await tx.reservation.create({
        data: {
          restaurantId: data.restaurantId,
          customerId: customer.id,
          tableId: table.id,
          partySize: data.partySize,
          startTime,
          endTime,
          notes: data.notes,
          status: "PENDING",
          paymentRequired: !!data.requireDeposit,
          depositAmount: data.depositAmount ?? null,
          paymentStatus: data.requireDeposit ? "REQUIRED" : "NOT_REQUIRED",
        },
        include: { customer: true, restaurant: true, table: true },
      })
      // Increment customer stats
      await tx.customerProfile.update({
        where: { id: customer.id },
        data: { totalBookings: { increment: 1 } },
      })
      return created
    })

    // Fire-and-forget automations (best to queue; simplified inline)
    try {
      const phone = reservation.customer.phone
      if (phone) {
        await sendWhatsAppMessage({
          toPhoneE164: phone,
          text: `Hi ${reservation.customer.name}, your reservation is received for ${reservation.startTime.toISOString()}. We will confirm shortly.`,
        })
      }
    } catch {}

    try {
      if (reservation.customer.email) {
        await sendGmail({
          to: reservation.customer.email,
          subject: "Reservation received",
          html: `<p>Thanks ${reservation.customer.name}, we received your reservation for ${reservation.startTime.toISOString()}.</p>`,
        })
      }
    } catch {}

    return Response.json({ reservation })
  } catch (e: any) {
    return Response.json({ error: e.message || "Invalid payload" }, { status: 400 })
  }
}
