export default async function CalendarPage() {
  // Template grid; replace with real Day/Week/Month views later
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Calendar (Month)</h2>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 28 }).map((_, i) => (
          <div key={i} className="border rounded-md p-2 min-h-32">
            <div className="text-xs text-muted-foreground mb-2">{"Day " + (i + 1)}</div>
            <div className="space-y-1">
              {i % 5 === 0 && <div className="text-xs rounded bg-muted p-1">19:00 • Alice • 4</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
