# Product Requirements Document (PRD)

## Fortune Telling & Spiritual Guidance Booking Platform

---

# 1. Product Overview

A premium digital platform for **fortune telling, astrology, tarot, numerology, and spiritual guidance services**.

The product enables users to:

* discover services
* understand practitioner credibility
* book live sessions
* complete intake forms
* pay securely
* receive reminders
* attend online or in-person sessions
* join future webinars and workshops

Primary markets:

* **India-first (Delhi in-person + online India)**
* **global online consultations**

---

# 2. Product Goal

Build a **high-conversion booking and consultation platform** optimized for:

* trust
* premium positioning
* seamless booking
* payment completion
* repeat sessions
* lead capture
* future webinar monetization

Primary KPI:

> **Booking conversion rate from landing page visitor → paid session**

---

# 3. Problem Statement

Current consultation businesses often lose conversions due to:

* fragmented WhatsApp/manual booking
* no real-time availability
* payment confusion
* missed reminders
* poor trust presentation
* no analytics
* no structured lead follow-up

This product solves these with a **single automated booking system**.

---

# 4. User Personas

## Persona A — Spiritual Seeker

* wants love/career clarity
* first-time visitor
* trust-sensitive
* mobile-first
* prefers WhatsApp communication

## Persona B — Repeat Client

* books recurring monthly guidance
* faster repeat checkout
* expects calendar reminders

## Persona C — Webinar User

* prefers workshops
* lower-ticket funnel entry
* can upsell into private consultation

---

# 5. Core User Stories

## Discovery

* As a visitor, I want to understand available services quickly.
* As a visitor, I want to know online vs in-person availability.

## Booking

* As a user, I want to choose a service and see live slots.
* As a user, I want secure payment before confirmation.
* As a user, I want reminders automatically.

## Session Prep

* As a user, I want to submit birth details and questions.
* As a practitioner, I want intake details before the session.

## Post Booking

* As a user, I want reschedule/cancel options.
* As a user, I want webinar invites and future offers.

---

# 6. Scope (MVP)

## Included

* landing website
* services catalog
* about page
* booking flow
* Google Calendar availability sync
* Razorpay payments
* intake form
* automated reminders
* contact callback form
* webinar registration
* analytics APIs

## Explicitly Deferred

* admin login
* RBAC / privilege matrix
* CMS
* manual slot controls UI
* multi-reader marketplace
* AI astrology engine
* mobile app

---

# 7. Functional Requirements

## FR-1 Homepage

### Must include

* hero section
* trust-building positioning
* primary CTA
* featured services
* how it works
* testimonials
* Delhi + worldwide support
* webinar teaser
* FAQs
* footer

Success metric:

* CTR on Book Now CTA

---

## FR-2 About Page

* founder story
* spiritual methodology
* years of experience
* reading philosophy
* trust proof

---

## FR-3 Services Catalog

Each service must support:

* title
* description
* duration
* price
* session mode
* ideal outcomes
* CTA

Initial services:

* Tarot Reading
* Astrology Consultation
* Numerology
* Love Compatibility
* Career Guidance
* Spiritual Healing

---

## FR-4 Availability Engine

System must:

* sync Google Calendar
* fetch busy blocks
* generate free slots
* support timezone conversion
* add session buffers
* prevent double booking
* support online + Delhi offline sessions

Critical rule:

> slot must be revalidated before payment order creation

---

## FR-5 Booking Flow

Booking steps:

1. choose service
2. select slot
3. fill intake form
4. payment
5. booking confirmation
6. calendar invite

Required fields:

* name
* email
* phone
* timezone
* DOB
* birth time
* birth place
* key concern
* custom questions

---

## FR-6 Payments

Provider: **Razorpay**

Supported:

* UPI
* cards
* net banking
* wallets
* international cards

Rules:

* full prepayment mandatory
* no slot confirmation without payment
* signature verification required
* duplicate webhook safe

---

## FR-7 Notifications

### Email + WhatsApp

Triggers:

* booking confirmed
* 24hr reminder
* 1hr reminder
* cancellation
* reschedule
* webinar reminder

Rules:

* no duplicate reminders
* retries on provider failure
* delivery logs required

---

## FR-8 Calendar Event Creation

On payment success:

* create Google Calendar event
* online → Meet link
* offline → Delhi address
* invite customer email
* block slot permanently

---

## FR-9 Lead Capture

Contact flow must support:

* callback request
* lead source
* UTM capture
* campaign attribution
* optional newsletter opt-in

---

## FR-10 Webinar System

Future-ready MVP support:

* webinar listing
* registration
* reminders
* waitlist
* replay link delivery

---

## FR-11 Analytics

Track:

* visitors
* leads
* booking conversion
* revenue by service
* repeat bookings
* payment failures
* webinar conversion

---

# 8. Non-Functional Requirements

## Performance

* page load < 2s on 4G
* booking APIs < 500ms p95 (excluding payment)

## Reliability

* idempotent payment verification
* webhook replay safety
* retryable notifications
* race-safe slot booking

## Security

* validate all payloads with zod
* signed webhook verification
* encrypted secrets
* secure calendar OAuth storage

## Scalability

Must support:

* multiple services
* webinar growth
* multi-city expansion
* future multiple practitioners

---

# 9. UX Requirements

Design language:

* soft minimalism
* muted palette
* celestial gradients
* calm typography
* whitespace heavy
* rounded cards
* premium trust feel

Avoid:

* bold aggressive colors
* dense forms
* long initial friction

---

# 10. Technical Requirements

## Frontend

* Next.js
* Tailwind
* Framer Motion

## Backend

* Node.js
* Express
* Prisma
* PostgreSQL

## Integrations

* Google Calendar API
* Razorpay
* Email provider
* WhatsApp API
* analytics provider

---

# 11. API Modules (MVP)

* services
* availability
* bookings
* payments
* calendar sync
* notifications
* leads
* webinars
* analytics
* webhooks

Admin module intentionally excluded.

---

# 12. Risks

* timezone edge cases
* payment success but calendar failure
* reminder duplication
* webhook retries
* Google API quota
* abandoned payment slots

Mitigations:

* DB transactions
* retry queues
* reminder logs
* stale pending cleanup cron

---

# 13. Release Plan

## Phase 1

* landing pages
* services
* booking
* payment
* calendar sync
* reminders

## Phase 2

* webinar funnel
* lead attribution
* analytics expansion

## Phase 3

* admin module
* privilege system
* CMS
* slot controls

---

# 14. Success Metrics

Primary:

* landing → paid booking conversion

Secondary:

* payment completion rate
* repeat session rate
* callback lead conversion
* webinar → consultation upsell
* reminder delivery success

---

# 15. Final Build Principle

The product must prioritize:

> **trust → frictionless booking → payment completion → repeat retention**

Everything in MVP should directly improve one of these four outcomes.
