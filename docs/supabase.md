# Supabase Database Management

Mystery Scoop uses Supabase Postgres as the managed database and Prisma as the typed schema, client, and migration layer.

## Required Supabase Values

Add these to `.env` locally and to your deployment provider:

```bash
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://PROJECT_REF.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."
```

Use `DATABASE_URL` for app runtime traffic. Use `DIRECT_URL` for migrations and one-off database operations.

## Local Commands

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:deploy
pnpm db:studio
```

## Database Tables

Prisma creates separate Supabase Postgres tables for the main app domains:

- `User`, `Session`: customer/admin accounts and login sessions.
- `ScoopTier`, `AddOn`: storefront products and paid options.
- `Order`, `OrderItem`, `Payment`, `Shipping`: checkout and fulfillment.
- `BulkInventory`: admin inventory tracking and low-stock management.
- `Review`, `ScoopPointsLedger`: customer feedback and rewards.
- `StorageAsset`: metadata for objects stored in Supabase Storage buckets.

Run `pnpm db:deploy` in production or `pnpm db:migrate` during local development to apply schema changes.

Admins can browse these tables in the app at `/admin/database`. The page shows friendly table names, row counts, and recent records, then routes edits to safer dedicated admin pages such as fulfillment and inventory.

## Storage Buckets

Supabase Storage is used for images and videos. Run `supabase/storage-buckets.sql` in the Supabase SQL editor, or trigger the `Supabase Storage Setup` GitHub Action.

Buckets:

- `product-images`: public product and marketing images.
- `profile-avatars`: public customer profile avatars.
- `inventory-images`: private admin inventory images.
- `scoop-photos`: private customer scoop reveal photos.
- `packing-videos`: private customer packing videos.

Runtime uploads can use `src/lib/supabase-storage.ts`. Store the resulting bucket/path metadata in `StorageAsset`; use signed URLs for private buckets such as `scoop-photos` and `packing-videos`.

## GitHub Secrets

Create these repository or environment secrets:

```bash
SUPABASE_DIRECT_DATABASE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

`SUPABASE_DIRECT_DATABASE_URL` should use Supabase's direct Postgres connection, not the pooled runtime URL.

## Automation

- `.github/workflows/ci.yml` runs lint, tests, Prisma validation, and a production build.
- `.github/workflows/supabase-migrate.yml` is a manual workflow for deploying Prisma migrations to Supabase.
- `.github/workflows/supabase-storage.yml` is a manual workflow for creating/updating Supabase Storage buckets and policies.
