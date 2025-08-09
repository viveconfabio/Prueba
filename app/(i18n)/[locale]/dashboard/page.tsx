import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AIAssistant } from "@/components/ai-assistant"

export default async function DashboardPage() {
  // Server Component page (RSC) [^2][^3]
  // Replace counts with real DB queries later
  const countReservations = 12
  const countCustomers = 8
  const countCancellations = 2

  return (
    <main className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{countReservations}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{countCustomers}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Cancellations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{countCancellations}</div>
        </CardContent>
      </Card>

      <div className="md:col-span-3">
        <AIAssistant />
      </div>
    </main>
  )
}
