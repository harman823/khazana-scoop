# Khazana Scoop MVP

React TypeScript storefront with a Python FastAPI backend and Prisma ORM for the Khazana Scoop ecommerce MVP.

## Run Locally

Install dependencies:

```powershell
npm install
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
```

Create and seed the Prisma SQLite database:

```powershell
$env:Path = "$PWD\.venv\Scripts;$env:Path"
.\.venv\Scripts\python.exe -m prisma generate
npx prisma db push
.\.venv\Scripts\python.exe -m backend.seed
```

Start the backend:

```powershell
.\.venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

Start the frontend:

```powershell
npm run dev -- --host 127.0.0.1 --port 5173
```

Open:

```text
http://127.0.0.1:5173
```

Admin:

```text
http://127.0.0.1:5173/admin
```

Default MVP password:

```text
khazana-admin
```

Change it in `.env` with `ADMIN_PASSWORD`.

## Verification

```powershell
npm run build
.\.venv\Scripts\python.exe -m compileall backend
```

## MVP Notes

- Products, variants, customers, orders, and inventory are stored in SQLite through Prisma ORM.
- Checkout simulates prepaid verification and creates a paid order for admin fulfilment.
- Admin has protected routes for overview, orders, inventory, products, customers, and analytics.
- Admin can update order status, tracking number, inventory stock/cost/sell price/status, and create products.
- Razorpay payment verification, hashed/admin-user authentication, and deployment database hardening are the next production steps.
