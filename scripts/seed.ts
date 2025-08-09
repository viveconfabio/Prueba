import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

async function main() {
  const ownerEmail = "owner@example.com"
  const password = await hash("password123", 10)

  const owner = await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {},
    create: { email: ownerEmail, name: "Owner", role: "OWNER", ...({ password } as any) },
  })

  const r = await prisma.restaurant.upsert({
    where: { slug: "demo-bistro" },
    update: {},
    create: {
      name: "Demo Bistro",
      slug: "demo-bistro",
      timezone: "America/Los_Angeles",
      users: { connect: { id: owner.id } },
      tables: {
        create: [
          { name: "T1", capacity: 2 },
          { name: "T2", capacity: 4 },
          { name: "T3", capacity: 6 },
        ],
      },
      availabilityRules: {
        create: Array.from({ length: 7 }).map((_, day) => ({
          dayOfWeek: day,
          openTime: "11:00",
          closeTime: "22:00",
          intervalMin: 15,
          isOpen: true,
        })),
      },
    },
  })

  const alice = await prisma.customerProfile.create({
    data: { name: "Alice", email: "alice@example.com", phone: "+14155550123" },
  })

  await prisma.reservation.create({
    data: {
      restaurantId: r.id,
      customerId: alice.id,
      table: { connect: { restaurantId_name: { restaurantId: r.id, name: "T2" } } } as any, // if you add unique constraint
      partySize: 4,
      startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 90 * 60000),
      status: "CONFIRMED",
    },
  })

  console.log("Seeded demo restaurant and data.")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
