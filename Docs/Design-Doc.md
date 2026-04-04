# System Design Document (SDD)

## Fortune Telling & Spiritual Guidance Booking Platform

---

# 1. Objective

Define the **technical architecture, module boundaries, data flow, integration contracts, failure handling, and deployment topology** for the MVP booking platform.

This document converts the PRD into an **implementation-safe engineering blueprint**.

Admin authentication and privilege systems are intentionally **out of scope for this version**.

---

# 2. Architecture Style

Use a **modular monolith** for MVP.

Reason:

* fastest iteration speed
* easy deployment
* strong transactional consistency
* simple LLM code generation
* fewer distributed failure points

### Pattern

```text
Client (Next.js)
   ↓
API Layer (Express)
   ↓
Business Services
   ↓
Repository Layer
   ↓
PostgreSQL
```

External integrations:

* Razorpay
* Google Calendar
* Email provider
* WhatsApp provider

---

# 3. High-Level Components

## Frontend

* landing pages
* service discovery
* availability selection
* booking checkout
* callback forms
* webinar registration

## Backend Modules

* services
* availability
* bookings
* payments
* calendar
* notifications
* leads
* webinars
* analytics
* webhooks
* schedulers

## Infrastructure

* PostgreSQL
* Redis *(optional later for queues)*
* cron scheduler
* Vercel (frontend)
* VPS / Railway / Render backend

---

# 4. Backend Module Design

## 4.1 Services Module

Responsibilities:

* list active services
* fetch service by slug
* pricing metadata
* duration metadata
* session mode metadata

Output contract:

* service cards
* booking metadata

---

## 4.2 Availability Module

Responsibilities:

* fetch Google busy blocks
* merge busy ranges
* generate slots
* apply timezone conversions
* exclude pending locks
* exclude confirmed bookings

### Slot Generation Formula

```text
working_hours - busy_blocks - pending_locks - confirmed_bookings
```

Design rule:

* slot generation must be deterministic
* no frontend-generated slots

---

## 4.3 Booking Module

Responsibilities:

* validate booking payload
* revalidate slot atomically
* create pending booking
* save intake answers
* create payment order
* temporary slot lock

States:

* PENDING
* CONFIRMED
* CANCELLED
* RESCHEDULED
* FAILED

---

## 4.4 Payment Module

Responsibilities:

* create Razorpay order
* verify signature
* idempotent verification
* save transaction metadata
* transition booking state
* trigger post-payment workflows

### Critical invariant

> booking confirmation happens only after verified payment signature

---

## 4.5 Calendar Module

Responsibilities:

* create Google event
* add Meet link
* attach Delhi address for offline
* invite customer
* store event mapping
* cancel/move event

Failure rule:

* calendar sync must be retryable

---

## 4.6 Notifications Module

Responsibilities:

* template rendering
* email delivery
* WhatsApp delivery
* retry failed sends
* reminder logs

Reminder types:

* booking confirmation
* 24 hr
* 1 hr
* cancellation
* reschedule
* webinar

---

## 4.7 Lead Module

Responsibilities:

* callback form capture
* UTM storage
* attribution source
* campaign tracking
* webinar lead funnel

---

## 4.8 Webinar Module

Responsibilities:

* webinar listing
* registration
* waitlist
* reminder automation
* replay token delivery

---

## 4.9 Analytics Module

Responsibilities:

* service conversion metrics
* lead conversion
* booking completion
* repeat clients
* payment failure rates
* webinar funnel metrics

---

# 5. Data Model Design

## Core Tables

* `services`
* `bookings`
* `payments`
* `intake_forms`
* `calendar_event_map`
* `reminder_logs`
* `leads`
* `webinars`
* `webhook_events`

## Key Relationships

```text
Service 1 → N Bookings
Booking 1 → 1 Payment
Booking 1 → 1 IntakeForm
Booking 1 → 1 CalendarEventMap
Booking 1 → N ReminderLogs
Webinar 1 → N Leads
```

---

# 6. API Contract Design

Base:

```text
/api/v1
```

## Public APIs

* `GET /services`
* `GET /services/:slug`
* `GET /availability`
* `POST /bookings/initiate`
* `POST /payments/verify`
* `POST /bookings/cancel`
* `POST /bookings/reschedule`
* `POST /leads/callback`
* `GET /webinars`
* `POST /webinars/register`

## Internal APIs

* webhook handlers
* cron-trigger routes if required

---

# 7. Critical Sequence Flows

## 7.1 Booking Success Flow

```text
User selects slot
→ API validates slot
→ Pending booking created
→ Razorpay order created
→ User pays
→ Signature verified
→ Booking confirmed
→ Calendar event created
→ Confirmation sent
→ Reminder jobs scheduled
```

---

## 7.2 Cancellation Flow

```text
Cancel request
→ Validate cancellation window
→ Refund if eligible
→ Cancel Google event
→ Release slot
→ Notify customer
→ Log cancellation
```

---

## 7.3 Reminder Flow

```text
Hourly cron
→ Query next 24h bookings
→ Exclude already reminded
→ Send reminders
→ Log ReminderLog
→ Retry failures
```

---

# 8. Failure Handling Design

## Payment Success but Calendar Failure

Mitigation:

* booking remains CONFIRMED
* enqueue calendar retry job
* alert logs
* manual recovery endpoint later

## Duplicate Webhooks

Mitigation:

* persist webhook eventId
* reject processed ids
* replay-safe handlers

## Slot Race Condition

Mitigation:

* DB transaction
* unique booking lock constraint
* final slot recheck before order creation

## Reminder Duplication

Mitigation:

* ReminderLog uniqueness
* retry tokens

---

# 9. Scheduler Design

Use **node-cron**.

Jobs:

* 24 hr reminders
* 1 hr reminders
* cleanup stale pending bookings
* retry failed notifications
* retry failed calendar sync
* webinar reminders

Run frequency:

```text
every 1 hour
```

Stale booking cleanup:

```text
PENDING > 15 min → auto expire
```

---

# 10. Security Design

Rules:

* zod validation for every payload
* signed Razorpay verification
* Google OAuth secrets in env only
* webhook signature validation
* sanitized callback forms
* rate limit public forms
* prevent email enumeration

No admin auth yet.

---

# 11. Performance Design

Targets:

* services API < 100ms
* availability API < 300ms
* booking initiation < 500ms
* payment verification < 300ms

Optimization:

* cache service catalog
* memoize timezone helpers
* batch reminder queries
* selective Prisma fields

---

# 12. Deployment Topology

## Frontend

* Vercel

## Backend

* Railway / Render / VPS

## Database

* PostgreSQL (Neon / Supabase / managed)

## File / Logs

* cloud log provider

## Secrets

* platform env manager

---

# 13. Observability

Track:

* booking failures
* payment verification failures
* calendar retry count
* reminder retry count
* stale pending cleanup count
* webhook duplicate rate

Logs must include:

* request id
* booking id
* payment order id
* webhook event id

---

# 14. LLM-Safe Engineering Rules

All code generation must follow:

```text
schema → route → validation → controller → service → repository → tests
```

Simple code only:

* small functions
* early returns
* no premature abstractions
* no classes for MVP
* plain deterministic functions

Review loop:

* every 5 files run architecture review
* normalize naming drift
* remove repeated utilities
* log recurring issues

---

# 15. Future Expansion Paths

Reserved architecture upgrades:

* admin auth module
* RBAC
* manual slot controls
* CMS
* multi-reader marketplace
* queue workers
* Redis locks
* AI astrology insights
* mobile apps

Current design keeps these future-safe without overengineering MVP.

---

# 16. Final Engineering Principle

The system must optimize for:

> **booking integrity → payment certainty → reminder reliability → repeat retention**

Every module must directly strengthen one of these guarantees.
