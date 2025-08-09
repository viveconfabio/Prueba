import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { reason, type } = z
      .object({ reason: z.string().optional(), type: z.enum(["CUSTOMER", "RESTAURANT", "SYSTEM"]).optional() })
      .parse(await req.json())
    const id = params.id

    const updated = await prisma.$transaction(async (tx) => {
      const resv = await tx.reservation.update({
        where: { id },
        data: { status: "CANCELLED", paymentStatus: "REFUNDED" },
        include: { customer: true },
      })
      await tx.cancellationLog.create({
        data: {
          reservationId: id,
          reason: reason || null,
          type: (type as any) || "RESTAURANT",
          token: `tok_${id}`,
        },
      })
      return resv
    })

    return Response.json({ reservation: updated })
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 400 })
  }
}
