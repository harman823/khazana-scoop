Full Backend TODO List (Node.js) — Admin Deferred
Phase 0 — Project Setup
Create backend/
Run npm init -y
Install runtime dependencies
express
cors
dotenv
zod
prisma
@prisma/client
razorpay
googleapis
dayjs
resend / nodemailer
Install dev dependencies
typescript
ts-node
nodemon
jest
supertest
eslint
prettier
Create folders
src/config
src/routes
src/controllers
src/services
src/repositories
src/middlewares
src/jobs
src/utils
src/lib
prisma
Phase 1 — Environment + Config
Create .env
Add:
DATABASE_URL
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI
EMAIL_API_KEY
WHATSAPP_API_KEY
Create env validator using zod
Validate on app boot
Crash app if config invalid
Phase 2 — Database Schema

Create Prisma models:

Service
Booking
Payment
IntakeForm
ReminderLog
Lead
Webinar
WebhookEvent
CalendarEventMap (recommended)

Add enums:

BookingStatus
PaymentStatus
SessionMode
ReminderType
LeadStatus

Add indexes:

booking datetime
client email
payment orderId
webhook eventId
service slug

Run migration

Seed initial services:

Tarot Reading
Astrology Consultation
Numerology
Love Compatibility
Career Guidance
Spiritual Healing
Phase 3 — App Bootstrap
Create src/app.ts
Add middleware
express json
cors
request logger
request id
global error handler
Add /health
Add /api/v1
Add API version constants
Add centralized route registry
Phase 4 — Services Module

Routes:

GET /services
GET /services/:slug

Subtasks for each:

define route contract
zod validation
controller
service
repository
tests

Deferred for later:

create/update/delete service admin routes
Phase 5 — Availability Engine
Setup Google Calendar integration
Build calendar client factory
Fetch busy ranges
Merge overlapping blocks
Generate free slots
based on duration
timezone-safe
add pre/post buffer
Exclude:
confirmed bookings
pending locked bookings
manual blocks (future admin)
GET /availability
race-condition-safe slot regeneration
Phase 6 — Booking Initiation

POST /bookings/initiate

Atomic subtasks:

validate payload
serviceId
datetime
timezone
clientName
email
phone
recheck slot atomically
create pending booking
persist intake form
create Razorpay order
persist payment orderId
lock slot temporarily
return checkout payload
Phase 7 — Payment Verification

POST /payments/verify

Subtasks:

verify Razorpay signature
fetch booking using orderId
start DB transaction
reject duplicate verification
mark payment success
mark booking confirmed
save transaction id
unlock permanent booking slot
commit transaction
enqueue post-payment jobs
Phase 8 — Calendar Sync

Triggered after payment success

Subtasks:

create Google Calendar event
online session → add Google Meet
in-person → add Delhi location
invite client email
save external calendar event id
save mapping in CalendarEventMap
confirm slot blocked
Phase 9 — Notifications Engine

Channels:

email
WhatsApp

Templates:

booking confirmed
24hr reminder
1hr reminder
cancellation
reschedule
webinar reminder

Subtasks:

notification interface
provider adapters
template renderer
retry logic
dead-letter logging
delivery logs
Phase 10 — Scheduler / Cron Jobs

Run every hour

Subtasks:

find bookings in next 24h
send 24h reminders
mark ReminderLog
find bookings in next 1h
send 1h reminders
prevent duplicates
retry failed reminders
cleanup stale pending bookings
Phase 11 — Cancellation + Reschedule
Cancellation
POST cancel route
validate refund window
refund eligible payments
cancel Google event
release booking slot
notify customer
log cancellation reason
Reschedule
POST reschedule route
validate new slot
recheck conflicts
move calendar event
update booking datetime
notify customer
log reschedule history
Phase 12 — Lead Capture APIs
POST callback request
validate phone/email
save lead source
save UTM params
save landing page referrer
optional newsletter opt-in
list leads (public-safe internal use only for now)
Phase 13 — Webinar APIs
GET webinars
POST webinar registration
save webinar lead
send webinar reminders
waitlist support
replay access token support
Phase 14 — Analytics APIs

Public business analytics endpoints:

total visits
total leads
conversion rate
revenue by service
top booked services
repeat clients
webinar conversion
failed payment rate

Keep raw admin analytics deferred.

Phase 15 — Webhook Safety + Idempotency
verify webhook signatures
save eventId
reject duplicate webhooks
replay-safe event processing
persist raw webhook payload
failure retry queue
dead-letter recovery endpoint
Phase 16 — Testing
Unit
slot generator
signature verification
pricing calculators
reminder scheduler
Integration
booking flow
payment verification
cancellation
reschedule
webinar registration
Reliability
timezone edge cases
concurrent booking race conditions
duplicate webhook replays
retry job safety
Phase 17 — Deployment
Dockerfile
docker-compose for local
CI/CD pipeline
migration on deploy
structured logs
alerts
uptime monitoring
DB backups
secret rotation
rollback strategy
Deferred Entirely (Do Later)
Future Admin Module

Do not build now:

admin login
RBAC
privileges
dashboard auth
audit trails
CSV export controls
service management CMS
manual slot block UI

This becomes a separate backend milestone when the admin page is designed.