import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth, { type NextAuthOptions, type DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import { compare } from "bcryptjs"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: "OWNER" | "ADMIN" | "STAFF" | "CUSTOMER"
    } & DefaultSession["user"]
  }
  interface User {
    role: "OWNER" | "ADMIN" | "STAFF" | "CUSTOMER"
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    // Optional credentials login for local/dev
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user) return null
        // expect a "password" field only for seeded/dev users
        // for production, prefer OAuth and secure password strategy (omitted)
        const pass = (user as any).password as string | undefined
        if (!pass) return null
        const ok = await compare(credentials.password, pass)
        return ok ? user : null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "STAFF"
        token.id = (user as any).id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = (token.role as any) || "STAFF"
      }
      return session
    },
  },
  pages: {},
  secret: process.env.NEXTAUTH_SECRET,
}

export const { handlers, auth } = NextAuth(authOptions)
