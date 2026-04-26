# KOSMICALIGN

Full-stack booking app for Kosmic Align.

- `backend/` is the Express + Prisma + PostgreSQL API.
- `frontend/` is the Vite + React client.
- `api/` contains the Vercel serverless entrypoints that expose the Express app and scheduled jobs in production.
- The frontend talks to the backend through Vite's `/api` proxy during local development.

## Project Structure

```text
KOSMICALIGN/
|- backend/
|  |- prisma/
|  `- src/
|- frontend/
`- Docs/
```

## Prerequisites

Install these first:

- Node.js LTS
- npm
- PostgreSQL

Optional integrations:

- Razorpay for real payments
- Google Calendar OAuth credentials for live calendar blocking + event creation
- SMTP credentials for real confirmation/reminder emails

## Local URLs

- Backend API: `http://localhost:3000`
- Frontend app: `http://localhost:5173`
- Health check: `http://localhost:3000/health`

Notes:

- `http://localhost:3000` is the API, not the React app.
- The frontend proxies `/api` requests to `http://localhost:3000`.

## Backend Environment Variables

For local development, copy `.env.example` to either:

- `backend/.env`
- `.env.local`

The backend loader supports both locations. On Vercel, set the same keys in Project Settings -> Environment Variables.

### Required

```env
PORT=3000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME
RAZORPAY_KEY_ID=rzp_test_placeholder
RAZORPAY_KEY_SECRET=placeholder_secret
```

### Optional

```env
DIRECT_URL=
FRONTEND_URL=

GOOGLE_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
GOOGLE_REDIRECT_END_POINT=/oauth/callback
GOOGLE_CALENDAR_ID=primary
GOOGLE_TOKEN_ACCESS_TYPE=offline
GOOGLE_CALENDAR_SCOPE=https://www.googleapis.com/auth/calendar

START_TIME=10:00
END_TIME=18:00
APPOINTMENT_DURATION=60
APPOINTMENT_INTERVAL=30
START_OF_DAY=00:00
END_OF_DAY=23:59
TIME_FORMAT=HH:mm

SMTP_USER=
SMTP_PASS=

ADMIN_KEY=kosmicalign_admin_mock
CRON_SECRET=replace-with-a-long-random-secret
```

Behavior without optional credentials:

- Placeholder Razorpay keys keep checkout in mock mode.
- Missing Google Calendar credentials fall back to database-only availability and mock event creation.
- Missing SMTP credentials mock confirmation and reminder emails in logs instead of sending them.

## First-Time Setup

### 1. Install backend dependencies

```powershell
cd backend
npm install
```

1. Music therapy
2. Date time in billing
3. NPL 1st pe krna h (pos)
4. Payment gateway live (till further notice)


### 2. Configure the backend environment

Copy `.env.example` to `backend/.env` and fill in the values you need.

### 3. Generate Prisma client

```powershell
cd backend
npm run prisma:generate
```

### 4. Push the schema to PostgreSQL

This repo currently has no committed Prisma migrations, so local setup should use `db push`.

```powershell
cd backend
npm run prisma:push
```

### 5. Seed the database

This creates the initial services used by the booking flow.

```powershell
cd backend
npm run seed
```

### 6. Install frontend dependencies

```powershell
cd frontend
npm install
```

## How To Run The App

Use two terminals.

### Terminal 1: Run the backend

```powershell
cd backend
npm run dev
```

What starts automatically with the backend:

- Express API on port `3000`
- reminder cron job that checks every hour
- cleanup cron job that clears stale pending bookings every 15 minutes

### Terminal 2: Run the frontend

```powershell
cd frontend
npm run dev
```

Then open:

```text
http://localhost:5173
```

## Command Reference

### Backend Commands

Install dependencies:

```powershell
cd backend
npm install
```

Run the backend in development:

```powershell
cd backend
npm run dev
```

Generate Prisma client:

```powershell
cd backend
npm run prisma:generate
```

Push Prisma schema to the database:

```powershell
cd backend
npm run prisma:push
```

Seed the database:

```powershell
cd backend
npm run seed
```

Open Prisma Studio:

```powershell
cd backend
npx prisma studio
```

Type-check the backend:

```powershell
cd backend
npm run typecheck
```

Run the backend container with Docker:

```powershell
cd backend
docker compose up --build
```

### Frontend Commands

Install dependencies:

```powershell
cd frontend
npm install
```

Run the frontend in development:

```powershell
cd frontend
npm run dev
```

Build the frontend for production:

```powershell
cd frontend
npm run build
```

If PowerShell blocks the npm script, use:

```powershell
cd frontend
.\node_modules\.bin\vite.cmd build
```

## Booking Workflow Notes

- Services are seeded from `backend/prisma/seed.ts`.
- Live availability combines database bookings with Google Calendar events when Google OAuth is configured.
- Filled slots are blocked immediately after booking initiation.
- Fully busy days show as unavailable.
- Reminder emails are sent to the email captured in the intake form after a booking is confirmed.
- Session reminders run from local `node-cron` during development and from Vercel Cron endpoints in production.

## Vercel Deployment

This repo is configured for a single Vercel project:

- `frontend/dist` is deployed as the static site
- `api/handler.ts` serves the Express API on `/api/*`
- `api/cron/cleanup.ts` and `api/cron/reminders.ts` replace long-running in-process cron jobs
- `.vercelignore` keeps the legacy sandbox folder, docs, and local Google credential JSON out of the deployment bundle

### Required Vercel environment variables

- `DATABASE_URL`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `ADMIN_KEY`
- `CRON_SECRET`

### Recommended Vercel environment variables

- `FRONTEND_URL`
- `DIRECT_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `GOOGLE_ACCESS_TOKEN`
- `GOOGLE_REFRESH_TOKEN`
- `GOOGLE_TOKEN_EXPIRY_DATE`
- `SMTP_USER`
- `SMTP_PASS`

### Deploy steps

1. Create a Vercel project from the repo root.
2. Add the environment variables from `.env.example` in Vercel Project Settings.
3. Set `FRONTEND_URL` to your production domain, for example `https://kosmicalign.vercel.app`.
4. Set `CRON_SECRET` to a long random value and keep it secret.
5. Deploy with `vercel --prod` or by connecting the repo to Vercel Git deployment.
6. After the first deploy, run Prisma against the production database from `backend/`:

```powershell
cd backend
npm run prisma:generate
npm run prisma:push
npm run seed
```

### Production notes

- Replace placeholder Razorpay keys with real test or live keys.
- Configure Google Calendar OAuth credentials if you want live calendar blocking and Google Meet links.
- Configure `SMTP_USER` and `SMTP_PASS` if you want real emails instead of mocked delivery logs.
- Vercel Cron only triggers on production deployments.
- Hobby plans cannot run the required `*/15` and hourly schedules for this app. The cron endpoints are deployed and ready, but you will need either a Vercel Pro upgrade or an external scheduler to call them on schedule.
- This repo includes a GitHub Actions fallback scheduler in `.github/workflows/vercel-cron-fallback.yml`. Add the repository secret `CRON_SECRET` with the same value used in Vercel so GitHub Actions can call the protected cron endpoints.

## Troubleshooting

### `Cannot GET /` on port 3000

Use `http://localhost:5173` for the website. Port `3000` is the API server.

### Live availability says fallback or estimated

Make sure:

- the backend is running
- PostgreSQL is reachable through `DATABASE_URL`
- Google Calendar credentials are set if you want Google events to block time too

### Emails are not being sent

Check `SMTP_USER` and `SMTP_PASS`. Without them, email sending is mocked in the backend logs.

### Payment stays in mock mode

Replace placeholder Razorpay credentials in your local env file or Vercel environment variables with real Razorpay keys, then redeploy or restart the backend.

### API routes work locally but fail on Vercel

Make sure:

- the repo was deployed from the project root
- Vercel picked up the committed `vercel.json`
- `DATABASE_URL` and `CRON_SECRET` are set in Vercel Project Settings
- the production database has been prepared with `npm run prisma:push` and `npm run seed` from `backend/`
