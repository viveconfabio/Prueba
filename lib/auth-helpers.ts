import { auth } from "./auth"

export async function requireRole(roles: Array<"OWNER" | "ADMIN" | "STAFF">) {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Unauthorized")
  }
  if (!roles.includes(session.user.role as any)) {
    throw new Error("Forbidden")
  }
  return session
}
