"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatISO } from "date-fns"

export function ReservationButton({
  restaurantId = "",
  defaultPartySize = 2,
}: { restaurantId?: string; defaultPartySize?: number }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [partySize, setPartySize] = useState(defaultPartySize)
  const [date, setDate] = useState<string>(formatISO(new Date()).slice(0, 16))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  const submit = async () => {
    setLoading(true)
    setError(null)
    setOk(null)
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          customer: { name, email, phone },
          partySize,
          startTime: new Date(date).toISOString(),
          durationMin: 90,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed")
      setOk("Reservation created (template). Replace API with real DB later.")
      setOpen(false)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Reserve</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Reservation</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Customer name" />
          </div>
          <div className="grid gap-1">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
          </div>
          <div className="grid gap-1">
            <Label>Phone (E.164)</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+14155550123" />
          </div>
          <div className="grid gap-1">
            <Label>Party size</Label>
            <Input
              type="number"
              value={partySize}
              min={1}
              onChange={(e) => setPartySize(Number.parseInt(e.target.value || "1"))}
            />
          </div>
          <div className="grid gap-1">
            <Label>Date & time</Label>
            <Input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          {ok && <div className="text-sm text-green-600">{ok}</div>}
          <Button onClick={submit} disabled={loading}>
            {loading ? "Saving..." : "Create reservation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
