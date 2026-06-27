# KhazanaScoop

Production-oriented React + TypeScript storefront with FastAPI, Prisma, PostgreSQL, and Supabase Auth/Storage.

## Included

- Budget, Standard, and Premium scoop tiers with exact item counts, surprise gifts, compare-at pricing, and packing rules.
- Server-side catalog search, category/color/price filtering, and sorting.
- Checkout notes plus a dedicated exclusions field.
- Automatic free-shipping, fixed, percentage, and product-combo promotions.
- Authenticated customer order history and verified product reviews.
- Supabase PostgreSQL, Auth JWT verification, and an admin-only product asset bucket.

## Supabase setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env` and replace all project placeholders.
3. Use the transaction pooler URL for `DATABASE_URL` and the direct/session URL for `DIRECT_URL`.
4. Run [supabase/setup.sql](supabase/setup.sql) in the Supabase SQL editor to create the product asset bucket and storage policies.
5. Give store-owner Auth users `app_metadata.role = "admin"` before they upload product assets.

Never expose the service-role key in the Vite frontend. The browser only uses the Supabase anon key.

## Install and deploy the database

```powershell
npm install
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
npm run db:generate
npm run db:deploy
npm run db:seed
```

`db:deploy` applies the committed PostgreSQL migration. `db:seed` creates the catalog, tier rules, demo order/review, inventory, free-shipping offer, and combo offer.

## Run locally

```powershell
npm run dev
```

- Storefront: `http://127.0.0.1:5173`
- FastAPI: `http://127.0.0.1:8000`
- Admin: `http://127.0.0.1:5173/admin`

Change `ADMIN_PASSWORD` before deployment. Customer authentication is handled by Supabase; the current admin dashboard password remains a separate owner control.

## Verification

```powershell
npm run build
.\.venv\Scripts\python.exe -m compileall backend
```

## Production notes

- FastAPI verifies Supabase access tokens using project JWKS (or `SUPABASE_JWT_SECRET` for a legacy HS256 project).
- Authenticated checkout links `auth.users.id` to the public `Customer.authUserId` field.
- Order history requires authentication by default. Set `ALLOW_GUEST_ORDER_LOOKUP=true` only if email-only lookup is intentionally desired.
- Promotion eligibility and order totals are recalculated on the server; frontend prices are never trusted.
- Add a real payment provider/webhook before accepting live payments. The checkout route still marks the current prepaid simulation as paid.
