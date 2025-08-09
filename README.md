# Restaurant Reservation Management System

Full-stack Next.js App Router app with CRM-like customer listing, calendar, AI assistant, WhatsApp/Gmail automations, payments (Stripe/PayPal), role-based auth, and i18n (EN/ES). Built with TypeScript, Prisma ORM (PostgreSQL), Tailwind CSS, shadcn/ui, deployable on Vercel.

Key Features
- Customer listing with filters and loyalty ranking
- Reservations: list + calendar (day/week/month basis), manual entry, cancellation workflow
- WhatsApp integration: quick contact button and automated messages
- Email automations and campaign builder via Gmail API
- Payments: optional deposit/full prepayment; status in list and calendar
- AI Assistant: context-aware suggestions (Vercel AI SDK + Grok by xAI)
- Role-based auth with NextAuth: OWNER, ADMIN, STAFF
- i18n: English and Spanish routes
- Automations: reminders T-24h / T-1h, auto-cancel without reconfirmation
- Prisma migrations and seed data

Tech Highlights
- Next.js App Router (layouts, route handlers, RSC) [^next_examples]
- Client components only when needed with 'use client' [^use_client]
- shadcn/ui Sidebar and components [^shadcn]
- Vercel AI SDK for AI endpoints [^ai_sdk]
- Incremental full-stack flow, colocated API routes [^v0_fullstack]

Getting Started
1) Prereqs
- Node.js LTS, pnpm/npm
- PostgreSQL (or SQLite for quick local testing)
- Vercel account for deployment (recommended)

2) Configure env
- Copy .env.example to .env and fill values. For local dev, you can set:
  DB_PROVIDER=postgresql
  DATABASE_URL=postgresql://user:password@localhost:5432/resto

3) Install & Generate
- Install dependencies
  npm install
- Generate Prisma client and push schema
  npx prisma db push
- Seed demo data
  ts-node scripts/seed.ts

4) Run
  npm run dev
  Open http://localhost:3000/en/dashboard

i18n
- Locale segment routes: /en, /es
- Add more translations in /locales

Auth (NextAuth)
- Uses Google OAuth or dev Credentials.
- Ensure NEXTAUTH_URL and NEXTAUTH_SECRET set.
- For Google provider set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.

Payments
- Stripe: set STRIPE_SECRET_KEY. The checkout route returns a session URL.
- PayPal: set PAYPAL_CLIENT_ID/PAYPAL_CLIENT_SECRET and implement Orders API (placeholder provided).

WhatsApp
- Use WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID (Cloud API).
- In-app button uses wa.me links; automations call Graph API.

Gmail (Campaigns/Emails)
- Configure GMAIL_* vars. Use OAuth Playground to obtain refresh token.
- API route /api/emails/send for individual sends; /api/campaigns for segments.

Automations
- Add a Vercel Cron job to POST /api/automations/process every 15 minutes to send reminders and auto-cancel stale pending bookings. [^v0_fullstack]

Database Models
- See prisma/schema.prisma for User, Restaurant, Table, Reservation, AvailabilityRule, CustomerProfile, PaymentRecord, CancellationLog, Campaign.

Security Notes
- Validate and sanitize inputs at route handlers.
- Server-side data fetching by default (RSC) to minimize client data exposure. [^next_examples]
- Configure CSP and secure cookies on Vercel.
- Use webhooks signature verification for payments in production.

Performance
- RSC for pages; client components only when needed (forms, AI assistant). [^use_client][^next_examples]
- Code splitting via App Router. [^next_examples]
- Optimize images using next/image if adding media.

Testing
- Vitest examples in /tests. Configure test env and database (e.g., SQLite file).
- Add scripts:
  "test": "vitest"

Deployment (Vercel)
- Push repo, import to Vercel, set env vars, and deploy.
- Add Vercel Cron for automations.
- Add a Postgres add-on (Neon) and update DATABASE_URL.

Common Pitfalls
- Mixing client/server boundaries; only add 'use client' where necessary. [^use_client]
- Missing envs for providers; checkout/emails/whatsapp will fail gracefully if unconfigured.
- Not accounting for timezones; ensure restaurant.timezone is respected in production.

Roadmap
- Add granular filters, exports (CSV endpoints), advanced calendar drag & drop, payment webhooks (Stripe/PayPal), and more robust concurrency (row locks).

References
- [^next_examples] Next.js App Router examples and best practices.
- [^use_client] Proper use of 'use client' boundaries.
- [^ai_sdk] Vercel AI SDK usage.
- [^shadcn] shadcn/ui Sidebar docs.
- [^v0_fullstack] v0 full-stack workflow and best practices.

# Restaurant Reservation Admin Template

This is a Next.js App Router template with a ready-to-use admin dashboard:
- Sidebar layout, responsive pages for Dashboard, Reservations, Calendar, and Customers.
- Smart Reservation Button (modal) for manual entry.
- WhatsApp quick-contact link on bookings.
- Optional AI Assistant button powered by the Vercel AI SDK (uses XAI if configured).
- i18n routing: /en and /es.
- Prisma schema included as a starting point (DB optional in this template).

Quick Start
1) Install and run
   npm install
   npm run dev
   Open http://localhost:3000/en/dashboard

2) Optional: enable AI Assistant
   - Add XAI_API_KEY to your environment and restart.
   - The /api/ai/assistant endpoint will then use Grok (xAI).

3) Optional: connect a database
   - Fill .env from .env.example (DATABASE_URL).
   - Install Prisma CLI: npm i -D prisma
   - npx prisma db push
   - Replace API stubs under /app/api with real Prisma queries.

Notes
- Built with App Router and RSC for performance. Client components only where needed (forms, AI widget). [Next.js App Router examples] [^next_examples] [^app_examples] [Use Client] [^use_client]
- Sidebar built with shadcn/ui primitives. [^shadcn]
- AI via Vercel AI SDK and xAI. [^ai_sdk]
- This template is credential-agnostic: no prompts, stubs return mock data until you wire providers.
