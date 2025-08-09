import { prisma } from "@/lib/prisma"
import { sendGmail } from "@/lib/email"

export async function POST(req: Request) {
  const body = await req.json()
  const { name, segment, subject, bodyHtml, scheduleAt } = body
  const campaign = await prisma.campaign.create({
    data: { name, segment, subject, bodyHtml, scheduledAt: scheduleAt ? new Date(scheduleAt) : null },
  })
  // For demo, send immediately to segment
  const targets = await selectSegment(segment)
  for (const t of targets) {
    if (t.email) {
      try {
        await sendGmail({ to: t.email, subject, html: bodyHtml })
      } catch {}
    }
  }
  await prisma.campaign.update({ where: { id: campaign.id }, data: { sentAt: new Date() } })
  return Response.json({ ok: true, id: campaign.id })
}

async function selectSegment(segment: string) {
  switch (segment) {
    case "loyal_customers":
      return prisma.customerProfile.findMany({ where: { totalBookings: { gte: 3 } } })
    case "frequent_cancellers":
      return prisma.customerProfile.findMany({ where: { cancellationLogs: { some: {} } } })
    case "high_spenders":
      return prisma.customerProfile.findMany({ where: { totalSpent: { gte: 50000 } } }) // >= $500
    default:
      return prisma.customerProfile.findMany({ take: 50 })
  }
}
