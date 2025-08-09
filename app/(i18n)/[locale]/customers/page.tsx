export default async function CustomersPage() {
  // Template rows; replace with DB
  const customers = [
    {
      id: "c1",
      name: "Alice",
      email: "alice@example.com",
      phone: "+14155550123",
      totalBookings: 5,
      totalSpent: 32000,
      cancels: 0,
    },
    { id: "c2", name: "Bob", email: "bob@example.com", phone: "", totalBookings: 2, totalSpent: 9000, cancels: 2 },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Customers</h2>
      <div className="overflow-auto rounded-md border">
        <table className="min-w-[800px] w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2 text-left">Total Bookings</th>
              <th className="p-2 text-left">Total Spent</th>
              <th className="p-2 text-left">Flags</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.email}</td>
                <td className="p-2">{c.phone || "-"}</td>
                <td className="p-2">{c.totalBookings}</td>
                <td className="p-2">${(c.totalSpent / 100).toFixed(2)}</td>
                <td className="p-2">
                  {c.cancels >= 2 ? (
                    <span className="inline-flex items-center rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">
                      Frequent Canceller
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
