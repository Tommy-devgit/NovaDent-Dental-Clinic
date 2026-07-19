# NovaDent Dental Clinic

AI-powered dental clinic platform. Patients learn about the clinic and talk to an AI assistant on the public site; the automation stack (Vapi → n8n) writes leads and conversations into Neon; staff manage everything from the admin dashboard.

## Structure

```text
apps/
  landing/     Public marketing site + Vapi entry point + n8n inbound webhook
  dashboard/   Staff admin dashboard (leads, appointments, conversations, settings)
packages/
  database/    Prisma schema, migrations, generated client, repositories
  types/       Shared TypeScript types
  validations/ Shared zod schemas
  utils/       Shared constants and utilities (env, jwt, pagination)
  ui/          Shared design system (shadcn/ui + Radix primitives, Medical Blue theme)
```

This is an npm workspaces monorepo — one `node_modules`, one root install.

## Setup

```bash
npm install
```

Each app needs its own `.env` (copy from `.env):

- `apps/landing/.env` — `DATABASE_URL`, `VAPI_API_KEY`, `N8N_WEBHOOK_URL`, `N8N_WEBHOOK_SECRET`
- `apps/dashboard/.env` — `DATABASE_URL`, `JWT_SECRET`, `VAPI_API_KEY`, `N8N_WEBHOOK_URL`
- `packages/database/.env` — `DATABASE_URL`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `SEED_ADMIN_FIRST_NAME`, `SEED_ADMIN_LAST_NAME` (used by Prisma CLI and the seed script)

First-time database setup:

```bash
cd packages/database
npm run generate                                   # generate the Prisma client
node --env-file=.env ../../node_modules/prisma/build/index.js migrate deploy
npm run db:seed                                     # creates the first ADMIN user
```

## Development

```bash
npm run dev:landing      # http://localhost:3000
npm run dev:dashboard    # http://localhost:3000 (run on a different port if both are up)
```

## Automation

The public intake path is: **Vapi (voice) → n8n (workflow) → `POST /api/n8n/lead-intake` on the landing app → Neon**. That route requires an `Authorization: Bearer <N8N_WEBHOOK_SECRET>` header matching the landing app's env var — configure this in the n8n HTTP Request node that calls it. The dashboard never writes leads directly; it only reads from and updates records that already exist in Neon.
