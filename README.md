# Mystery Scoop

A Next.js App Router MVP for Mystery Scoop with Prisma, Supabase Postgres, Stripe checkout plumbing, customer order views, and admin fulfillment screens.

## Getting Started

First, install dependencies and run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database

Supabase manages the Postgres database. Prisma manages typed models and migrations.

Copy `.env.example` to `.env`, then add your Supabase pooled `DATABASE_URL` and direct `DIRECT_URL`.

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:studio
```

See `docs/supabase.md` for Supabase setup and GitHub secret names.

Supabase Storage buckets are defined in `supabase/storage-buckets.sql` for product images, profile avatars, inventory images, scoop photos, and packing videos.

## Automation

GitHub Actions are configured in `.github/workflows`:

- `ci.yml` runs Prisma validation, lint, tests, and build on pull requests and pushes to `main`.
- `supabase-migrate.yml` manually deploys Prisma migrations to Supabase using `SUPABASE_DIRECT_DATABASE_URL`.
- `supabase-storage.yml` manually applies Supabase Storage bucket and policy setup.

## Scripts

```bash
pnpm lint
pnpm test
pnpm build
pnpm db:deploy
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
