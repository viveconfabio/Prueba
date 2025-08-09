"use client"

import { useMemo } from "react"
import { ReservationButton } from "@/components/reservation-button"
import { Badge } from "@/components/ui/badge"
import { WhatsAppButton } from "@/components/whatsapp-button"

type Row = {
  id: string
  customer: { name: string; phone?: string } | null
  startTime: string
  status: "PENDING" | "CONFIRMED" | "CANCELLED"
  paymentRequired?: boolean
  paymentStatus?: "PAID" | "PENDING" | "NOT_REQUIRED"
}

export default function ReservationsPage() {
  // Template data; replace with DB fetching in production
  const reservations: Row[] = useMemo(
    () => [
      {
        id: "r1",
        customer: { name: "Alice", phone: "+14155550123" },
        startTime: new Date().toISOString(),
        status: "CONFIRMED",
        paymentRequired: false,
        paymentStatus: "NOT_REQUIRED",
      },
      {
        id: "r2",
        customer: { name: "Bob" },
        startTime: new Date(Date.now() + 86400000).toISOString(),
        status: "PENDING",
        paymentRequired: true,
        paymentStatus: "PENDING",
      },
    ],
    [],
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Reservations</h2>
        <ReservationButton restaurantId="demo-restaurant" />
      </div>
      <div className="rounded-md border divide-y">
        {reservations.map((r) => (
          <div key={r.id} className="p-3 flex items-center gap-3 flex-wrap">
            <div className="min-w-40">
              <div className="font-medium">{r.customer?.name || "Guest"}</div>
              <div className="text-sm text-muted-foreground">{new Date(r.startTime).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={r.status === "CONFIRMED" ? "default" : r.status === "CANCELLED" ? "destructive" : "secondary"}
              >
                {r.status}
              </Badge>
              {r.paymentRequired && (
                <Badge variant={r.paymentStatus === "PAID" ? "default" : "outline"}>{r.paymentStatus}</Badge>
              )}
            </div>
            <div className="ml-auto flex items-center gap-2">
              {r.customer?.phone && (
                <WhatsAppButton
                  phone={r.customer.phone}
                  message={`Hi ${r.customer.name}, your reservation ${r.id} is scheduled on ${new Date(
                    r.startTime,
                  ).toLocaleString()}. Reply YES to confirm.`}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
