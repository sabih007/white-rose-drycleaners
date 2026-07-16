# Dry Cleaner Portal

A password-protected portal for the shop owner to log bookings, look customers
up by phone number, print receipts, and text customers automatically.

## Features

- **New booking** — pick items from a price list, quantities auto-calculate the total, saved to Postgres.
- **Find by phone** — look up a customer's booking history by phone number.
- **Status tracking** — Received -> Ready -> Delivered. Marking a booking "Ready" texts the customer with the total due.
- **Printable receipt** — each booking has a receipt page with a Print button.
- **Price list** — editable list of item types and prices used on the booking form.
- **Login** — single shared password protects the whole portal.

## Local development

```bash
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:3000, or the next free
port if that one's taken).

## Environment variables

Copy `.env.example` to `.env` and fill these in (a working `.env` with a
**temporary** database is already included so you can try the app immediately
— see "Database" below):

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string. |
| `APP_PASSWORD` | The password used to log into the portal. **Change this before sharing the link.** |
| `SESSION_SECRET` | Random string used to sign login sessions. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. |
| `SHOP_NAME` | Shown in SMS messages and on the printed receipt. |
| `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` | From your [Twilio Console](https://console.twilio.com). Leave blank to disable SMS — bookings still save fine, they just won't text the customer. |

## Database

This repo comes with a **temporary** Prisma Postgres database (auto-deletes
after 24 hours) so the app runs out of the box. Before that expires, either:

- **Claim it permanently**: open the `CLAIM_URL` printed in `.env` in your
  browser and follow the prompts, or
- **Use your own Postgres**: create one via the
  [Vercel Marketplace](https://vercel.com/marketplace) (Neon, etc.) or any
  Postgres host, put its connection string in `DATABASE_URL`, then run:

  ```bash
  npx prisma migrate deploy
  ```

## Deploying to Vercel

1. Install the CLI: `npm i -g vercel`
2. From this folder: `vercel link`, then `vercel env add` for each variable
   above (`DATABASE_URL`, `APP_PASSWORD`, `SESSION_SECRET`, `SHOP_NAME`,
   `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`).
3. Deploy: `vercel --prod`

## Tech

Next.js (App Router) + Prisma/Postgres + Twilio, deployable on Vercel.
