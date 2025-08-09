import { prisma } from "@/lib/prisma"
import { sendWhatsAppMessage } from "@/lib/whatsapp"
import { sendGmail } from "@/lib/email"

// This route can be called by Vercel Cron to process reminders and auto-cancellations [^5]
export async function POST() {
  const now = new Date()
  const in1Day = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const in1Hour = new Date(now.getTime() + 60 * 60 * 1000)

  // 1. Send reminders for T-24h and T-1h
  const upcoming = await prisma.reservation.findMany({
    where: {
      status: { in: ["PENDING", "CONFIRMED"] },
      startTime: { gte: now, lte: in1Day },
    },
    include: { customer: true },
  })
  for (const r of upcoming) {
    if (r.customer?.phone) {
      try {
        await sendWhatsAppMessage({
          toPhoneE164: r.customer.phone!,
          text: `Reminder: Your reservation is in 24 hours at ${r.startTime.toISOString()}. Reply YES to confirm.`,
        })
      } catch {}
    }
    if (r.customer?.email) {
      try {
        await sendGmail({
          to: r.customer.email!,
          subject: "Reservation reminder",
          html: `<p>Your reservation is in 24 hours at ${r.startTime.toISOString()}.</p>`,
        })
      } catch {}
    }
  }

  // 2. Auto-cancel PENDING reservations at T-1h if not reconfirmed (example heuristic)
  const pendingSoon = await prisma.reservation.findMany({
    where: {
      status: "PENDING",
      startTime: { gte: now, lte: in1Hour },
      paymentStatus: { not: "PAID" },
    },
    include: { customer: true },
  })
  for (const r of pendingSoon) {
    await prisma.reservation.update({ where: { id: r.id }, data: { status: "CANCELLED" } })
    if (r.customer?.email) {
      try {
        await sendGmail({
          to: r.customer.email!,
          subject: "Reservation cancelled",
          html: `<p>We didn't receive reconfirmation. Your reservation was cancelled.</p>`,
        })
      } catch {}
    }
  }

  return Response.json({ ok: true, reminders: upcoming.length, autoCancelled: pendingSoon.length })
}
