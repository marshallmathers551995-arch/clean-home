# CleanHome

Online catalogue and ordering site for a household cleaning products seller.

Customers browse products and bundles, build an order, and either **pay online** (Stripe) or **send the order on WhatsApp**.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · PostgreSQL + Prisma · Zod · Stripe · Vitest

## Run it locally

Requires Node 22+ and Docker (for the local database).

```bash
npm install
cp .env.example .env     # defaults work as they are
npm run db:up            # starts PostgreSQL in Docker on port 5433
npx prisma migrate dev   # creates the tables
npm run db:seed          # loads the sample products and bundles
npm run dev              # http://localhost:3000
```

Locally, "Pay online" goes to a **mock payment page** (no Stripe account needed). That page does not exist in production.

Other scripts: `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm run db:studio` (browse the data), `npm run db:down`.

> The database uses port **5433** so it doesn't clash with a PostgreSQL already installed on your machine (port 5432).

**`PrismaClientInitializationError` on every page?** The database isn't reachable. Usually Docker Desktop isn't running: start it, then `npm run db:up`. If the tables are missing (for example after Docker was reset), run `npx prisma migrate deploy` and `npm run db:seed` again.

## Deploy to Vercel

### 1. Database
Create a free PostgreSQL database. **Neon** is the easiest (Vercel Dashboard → Storage / Marketplace → Neon). Pick the **Singapore** region, which is closest to Malaysian customers and matches `vercel.json` (`sin1`). You need two connection strings:

| Variable | Which string |
|---|---|
| `DATABASE_URL` | the **pooled** connection string |
| `DIRECT_URL` | the **direct / unpooled** connection string |

### 2. Push the code to GitHub, then import it at vercel.com
Vercel detects Next.js and builds with the default settings. The `postinstall` script generates the Prisma client; the build itself does not need the database.

### 3. Environment variables (Project → Settings → Environment Variables)

| Variable | Value |
|---|---|
| `DATABASE_URL` | pooled connection string |
| `DIRECT_URL` | direct connection string |
| `STRIPE_SECRET_KEY` | your Stripe secret key (`sk_test_...` to try it out, `sk_live_...` for real payments) |
| `STRIPE_WEBHOOK_SECRET` | from step 5 |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | digits only with country code, e.g. `60123456789`. Redeploy after changing it |
| `APP_URL` | optional on Vercel; set it once you have a custom domain |

Do **not** set `PAYMENT_PROVIDER` in production. If `STRIPE_SECRET_KEY` is missing, online payment switches itself off and checkout only offers WhatsApp.

### 4. Create the tables and load the products (once, from your own machine)
Put the two production connection strings in your shell, then:

```bash
DATABASE_URL="<direct string>" DIRECT_URL="<direct string>" npx prisma migrate deploy
DATABASE_URL="<direct string>" DIRECT_URL="<direct string>" npx prisma db seed
```

(PowerShell: set `$env:DATABASE_URL` and `$env:DIRECT_URL` first.) Run `migrate deploy` again whenever a new migration is added. The seed is safe to repeat. It updates products and bundles by slug and never touches orders.

### 5. Stripe
1. In the Stripe Dashboard, enable **Cards** and **FPX** (Settings → Payment methods).
2. Add a webhook endpoint: `https://<your-domain>/api/stripe/webhook`, event `checkout.session.completed`.
3. Copy its signing secret into `STRIPE_WEBHOOK_SECRET` and redeploy.
4. Place a test order with Stripe's test card `4242 4242 4242 4242`. The order should flip to **paid** within a few seconds.

### 6. Before real customers
- Replace the placeholder catalogue in `prisma/seed.ts` with the client's real products and prices, then re-run the seed.
- Set the real WhatsApp number.
- Vercel's free **Hobby** plan is for non-commercial use only. A live shop that takes orders needs the **Pro** plan.
- There is no admin screen yet. View orders with `npm run db:studio` (pointed at the production database) or in the Neon dashboard.

## Where things live

| What | Where |
|---|---|
| Products and bundles | `prisma/seed.ts` |
| Delivery areas, fee, free-delivery threshold | `src/lib/delivery.ts` |
| Order validation and server-side pricing | `src/lib/orders.ts` |
| Payment provider selection | `src/lib/payments.ts` |
| WhatsApp message format | `src/lib/whatsapp.ts` |
| Checkout API and Stripe webhook | `src/app/api/` |

Money is stored as integer sen (RM 6.90 = 690). Prices are always recalculated on the server from the database; the browser only sends item ids and quantities. A payment is only accepted if the amount Stripe reports matches the order total. Order numbers are random (`CH-7K3M9QXA`), because the order page shows the customer's name and address.

## Not done yet

Product photos (placeholder art is used), an admin screen for products and orders, order emails or notifications, other languages, and rate limiting on the checkout endpoint.
