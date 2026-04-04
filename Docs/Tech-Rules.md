Tech Stack Rules (MVP)
Frontend

Use only:

Next.js
TypeScript
Tailwind CSS
Framer Motion
React Hook Form
Zod
Axios
TanStack Query
Frontend Rules
use App Router only
use server components by default
use client components only when state/UI requires it
keep components small and reusable
one component = one responsibility
forms must use:
react-hook-form
zod resolver
API calls must go through:
src/lib/api.ts
no direct fetch inside random components
use simple prop interfaces
avoid deeply nested state
Backend

Use only:

Node.js
Express
TypeScript
Prisma
PostgreSQL
Zod
node-cron
Razorpay SDK
Google APIs SDK
Backend Rules

Folder structure:

src/
  routes/
  controllers/
  services/
  repositories/
  validations/
  middlewares/
  jobs/
  lib/
  utils/
Mandatory layering

Every feature must follow:

route
→ validation
→ controller
→ service
→ repository
→ tests

Never skip layers.

Example:

route = HTTP contract
validation = zod
controller = request/response
service = business logic
repository = Prisma only
Hard backend rules
Prisma only inside repository
no DB queries in controllers
no DB queries in routes
no business logic in routes
controllers must stay thin
services must be pure and reusable
repository methods must be deterministic
one transaction per critical flow
Database Rules

Use PostgreSQL + Prisma

Naming

Use simple names:

Booking
Payment
Service
Lead
Field naming

Use:

camelCase in code
snake_case in DB if needed by Prisma mapping

Example:

bookingDateTime
paymentOrderId
clientEmail
Migration Rules
one migration per schema change
never mix unrelated tables in one migration
review indexes every 3 migrations
soft-delete only if business-critical
use enums for finite states only
API Rules

All APIs must use:

/api/v1/

Example:

/api/v1/services
/api/v1/availability
/api/v1/bookings/initiate
Response Format

Always keep responses simple:

{
  success: true,
  data: {},
  message: "Booking created"
}

Error:

{
  success: false,
  message: "Slot unavailable"
}

Never return random response shapes.

Code Simplicity Rules

This is critical.

The LLM must write code in simple format

Rules:

short files
small functions
early returns
readable names
avoid abstractions too early
avoid generics unless necessary
avoid factory patterns in MVP
avoid class-based architecture
use plain functions
avoid nested ternary logic
max 1 level callback nesting
no “clever” code

Preferred:

if (!booking) return error;

Avoid:

booking ? process(booking) : fallback()
LLM Code Writing Rules

The LLM must generate code using this order only:

1. schema
2. route
3. validation
4. controller
5. service
6. repository
7. tests
Prompt Rule

one file = one prompt

Never ask LLM to generate:

entire feature
entire phase
multiple folders

Correct:

create booking service only

Wrong:

build full booking module

LLM Self-Review Rules

After every 3–5 generated files, the LLM must perform a review pass.

Review Checklist

Check for:

1) Repeated Bugs
repeated null checks missing
duplicate zod schemas
repeated response shape mismatch
Prisma query inconsistency
missing transactions
inconsistent enum usage
2) Structural Drift
route logic leaking into controller
DB logic leaking into service
service doing formatting
repeated utility duplication
3) Naming Drift
bookingId vs id
serviceSlug vs slug
paymentId vs transactionId

Normalize immediately.

LLM Learning Rules (Anti-Recurring Problems)

This is your continuous correction loop.

The LLM must maintain a project memory log:

/common-errors.md

Every review cycle append:

Issue:
Repeated duplicate payment verification logic

Fix:
Moved signature verification to shared util

Rule:
All payment signature verification must use lib/verifyRazorpay.ts
Mandatory learning loop

Every 5 prompts:

review generated files
log recurring mistakes
create permanent rule
refactor repeated patterns
update future prompts with the rule

This dramatically reduces recurring hallucinations.

Refactor Rules

Allowed only after feature stability.

Trigger refactor when:

same code repeated 3+ times
same zod schema repeated
same response formatter repeated
same calendar helper repeated
same reminder query repeated

Then extract to:

lib/
utils/
shared service helper

Do not refactor early.

Testing Rules

Minimum required per module:

Unit
service logic
util helpers
validators
signature verification
Integration
route → controller → service → repository
Reliability
duplicate webhook replay
race condition booking
timezone conversion
failed payment recovery
Git + Review Rules

Commit style:

feat: booking initiate route
fix: slot conflict race condition
refactor: extract payment signature util
test: add booking verification tests
PR Review Checklist

Before merge:

simple code?
naming consistent?
response format same?
zod validation present?
tests added?
duplicate logic introduced?
transactions needed?