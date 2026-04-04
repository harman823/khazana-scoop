import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { fetchAdminDashboard } from '../../lib/api';
import { useUI } from '../components/UIContext';

const ADMIN_KEY_STORAGE = 'kosmicalign.admin-key';
const DEFAULT_TIMEZONE = 'Asia/Kolkata';

type AdminSummary = {
  leadsCaptured: number;
  revenueCollected: number;
  totalBookings: number;
  bookingsConfirmed: number;
  pendingBookings: number;
  upcomingSessions: number;
  totalWebinars: number;
  totalServices: number;
  uniqueCustomers: number;
};

type ServiceDemand = {
  id: string;
  slug: string;
  title: string;
  durationMin: number;
  price: number;
  sessionMode: string;
  totalRequests: number;
  confirmedRequests: number;
  pendingRequests: number;
  cancelledRequests: number;
  failedRequests: number;
  revenueCollected: number;
  lastRequestedAt: string | null;
};

type BookingRecord = {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientTimezone: string;
  bookingDateTime: string;
  createdAt: string;
  status: string;
  paymentStatus: string;
  amount: number;
  currency: string;
  orderId: string | null;
  transactionId: string | null;
  keyConcern: string | null;
  birthPlace: string | null;
  meetLink: string | null;
  service: {
    title: string;
    slug: string;
    durationMin: number;
    price: number;
    sessionMode: string;
  };
};

type ScheduleLoad = {
  day: string;
  totalSessions: number;
  confirmedSessions: number;
  pendingSessions: number;
  bookedMinutes: number;
  services: string[];
};

type AdminDashboard = {
  summary: AdminSummary;
  serviceDemand: ServiceDemand[];
  recentBookings: BookingRecord[];
  upcomingSchedule: BookingRecord[];
  scheduleLoad: ScheduleLoad[];
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

const formatDateTime = (dateTime: string, timeZone = DEFAULT_TIMEZONE) => {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone,
    }).format(new Date(dateTime));
  } catch {
    return new Date(dateTime).toLocaleString();
  }
};

const formatScheduleDay = (day: string) => {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: DEFAULT_TIMEZONE,
    }).format(new Date(`${day}T00:00:00+05:30`));
  } catch {
    return day;
  }
};

const statusTone = (status: string) => {
  switch (status) {
    case 'CONFIRMED':
    case 'SUCCESS':
      return 'border-emerald-700/40 text-emerald-700 bg-emerald-700/10';
    case 'PENDING':
      return 'border-primary/40 text-primary bg-primary/10';
    case 'CANCELLED':
    case 'FAILED':
      return 'border-red-700/40 text-red-700 bg-red-700/10';
    default:
      return 'border-outline-variant text-on-surface-variant bg-surface-container';
  }
};

const StatCard = ({ label, value, note }: { label: string; value: string; note: string }) => (
  <div className="border border-outline-variant bg-surface px-6 py-6 shadow-ambient">
    <p className="font-mono text-xs uppercase tracking-[0.24em] text-on-surface-variant">{label}</p>
    <div className="mt-4 font-display text-4xl font-bold uppercase tracking-tighter text-on-surface">{value}</div>
    <p className="mt-3 font-body text-sm text-on-surface-variant">{note}</p>
  </div>
);

const StatusChip = ({ label }: { label: string }) => (
  <span className={`inline-flex border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] ${statusTone(label)}`}>
    {label}
  </span>
);

export function Admin() {
  const { isLoaded } = useUI();
  const [adminKey, setAdminKey] = useState('');
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async (key: string) => {
    const trimmedKey = key.trim();

    if (!trimmedKey) {
      setError('Enter the admin key to load live booking analytics.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetchAdminDashboard(trimmedKey);
      setDashboard(response.data as AdminDashboard);
      setAdminKey(trimmedKey);
      window.localStorage.setItem(ADMIN_KEY_STORAGE, trimmedKey);
    } catch (loadError) {
      setDashboard(null);
      setError(loadError instanceof Error ? loadError.message : 'Failed to load admin dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedKey = window.localStorage.getItem(ADMIN_KEY_STORAGE);

    if (!storedKey) {
      return;
    }

    setAdminKey(storedKey);
    void loadDashboard(storedKey);
  }, []);

  const handleClearAccess = () => {
    window.localStorage.removeItem(ADMIN_KEY_STORAGE);
    setAdminKey('');
    setDashboard(null);
    setError(null);
  };

  const summaryCards = dashboard
    ? [
        {
          label: 'Revenue Collected',
          value: formatCurrency(dashboard.summary.revenueCollected),
          note: 'Successful payments recorded through the live booking flow.',
        },
        {
          label: 'Confirmed Sessions',
          value: String(dashboard.summary.bookingsConfirmed),
          note: 'Confirmed bookings currently held in the calendar and database.',
        },
        {
          label: 'Pending Payments',
          value: String(dashboard.summary.pendingBookings),
          note: 'Bookings initiated but not fully completed at checkout yet.',
        },
        {
          label: 'Upcoming Schedule',
          value: String(dashboard.summary.upcomingSessions),
          note: 'Future pending and confirmed sessions waiting on the calendar.',
        },
        {
          label: 'Unique Customers',
          value: String(dashboard.summary.uniqueCustomers),
          note: 'Distinct customer emails captured in the booking pipeline.',
        },
        {
          label: 'Active Services',
          value: String(dashboard.summary.totalServices),
          note: 'Services currently visible to the public booking flow.',
        },
      ]
    : [];

  return (
    <div className="flex flex-col flex-grow bg-surface">
      <section className="px-6 lg:px-24 py-32 bg-surface-container-lowest text-on-surface">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-start">
          <motion.div
            className="lg:col-span-4"
            initial={{ opacity: 0, y: 40 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] as any }}
          >
            <p className="font-mono text-primary uppercase tracking-[0.3em] text-xs">Live Admin</p>
            <h1 className="mt-6 font-display text-6xl md:text-8xl font-bold uppercase tracking-tighter leading-none">
              Admin Signal
            </h1>
            <p className="mt-8 font-body text-lg text-on-surface-variant max-w-sm leading-relaxed">
              Monitor bookings, schedule pressure, and the services customers are actually choosing without leaving the site.
            </p>
          </motion.div>

          <motion.div
            className="lg:col-span-8 border border-outline-variant bg-surface p-8 lg:p-10 shadow-ambient"
            initial={{ opacity: 0, y: 40 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] as any }}
          >
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="flex-1">
                <label className="block font-mono text-xs uppercase tracking-[0.24em] text-on-surface-variant mb-3">
                  Admin Key
                </label>
                <Input
                  type="password"
                  value={adminKey}
                  onChange={(event) => setAdminKey(event.target.value)}
                  placeholder="Enter the admin access key"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      void loadDashboard(adminKey);
                    }
                  }}
                />
                <p className="mt-3 font-body text-sm text-on-surface-variant">
                  The key is stored only in this browser so you can refresh the dashboard without re-entering it every time.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button variant="secondary" onClick={handleClearAccess}>
                  Clear Access
                </Button>
                <Button variant="primary" onClick={() => void loadDashboard(adminKey)} disabled={loading}>
                  {loading ? 'Loading Dashboard...' : dashboard ? 'Refresh Dashboard' : 'Unlock Dashboard'}
                </Button>
              </div>
            </div>

            {error && (
              <div className="mt-6 border border-primary bg-surface-container px-4 py-4 font-mono text-xs uppercase tracking-[0.2em] text-primary">
                {error}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="px-6 lg:px-24 pb-32 bg-surface text-on-surface">
        {!dashboard && !loading && (
          <div className="border border-dashed border-outline-variant bg-surface-container-low p-12 text-center">
            <h2 className="font-display text-3xl font-bold uppercase tracking-tighter">Awaiting Admin Access</h2>
            <p className="mt-4 font-body text-on-surface-variant max-w-2xl mx-auto">
              Unlock the dashboard to view live bookings, schedule coverage, and which readings customers are requesting most.
            </p>
          </div>
        )}

        {loading && !dashboard && (
          <div className="border border-outline-variant bg-surface-container-low p-12 text-center font-mono text-sm uppercase tracking-[0.24em] text-on-surface-variant animate-pulse">
            Pulling live admin analytics...
          </div>
        )}

        {dashboard && (
          <div className="space-y-24">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {summaryCards.map((card) => (
                <StatCard key={card.label} label={card.label} value={card.value} note={card.note} />
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
              <div className="xl:col-span-7 space-y-6">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.24em] text-primary">Demand</p>
                    <h2 className="mt-3 font-display text-4xl font-bold uppercase tracking-tighter">Services Customers Request</h2>
                  </div>
                  <div className="font-mono text-xs uppercase tracking-[0.2em] text-on-surface-variant">
                    Total Bookings: {dashboard.summary.totalBookings}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dashboard.serviceDemand.map((service) => (
                    <div key={service.id} className="border border-outline-variant bg-surface p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-display text-2xl font-bold uppercase tracking-tighter">{service.title}</h3>
                          <p className="mt-2 font-mono text-xs uppercase tracking-[0.22em] text-on-surface-variant">
                            {service.sessionMode} • {service.durationMin} Min • {formatCurrency(service.price)}
                          </p>
                        </div>
                        <div className="border border-outline-variant px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">
                          {service.totalRequests} Requests
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-3 font-mono text-xs uppercase tracking-[0.18em]">
                        <div className="border border-outline-variant px-4 py-3">
                          <div className="text-on-surface-variant">Confirmed</div>
                          <div className="mt-2 text-on-surface">{service.confirmedRequests}</div>
                        </div>
                        <div className="border border-outline-variant px-4 py-3">
                          <div className="text-on-surface-variant">Pending</div>
                          <div className="mt-2 text-on-surface">{service.pendingRequests}</div>
                        </div>
                        <div className="border border-outline-variant px-4 py-3">
                          <div className="text-on-surface-variant">Cancelled</div>
                          <div className="mt-2 text-on-surface">{service.cancelledRequests}</div>
                        </div>
                        <div className="border border-outline-variant px-4 py-3">
                          <div className="text-on-surface-variant">Failed</div>
                          <div className="mt-2 text-on-surface">{service.failedRequests}</div>
                        </div>
                      </div>

                      <div className="mt-6 flex items-end justify-between gap-4">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">Revenue</p>
                          <p className="mt-2 font-display text-3xl font-bold uppercase tracking-tighter">
                            {formatCurrency(service.revenueCollected)}
                          </p>
                        </div>
                        <div className="max-w-[220px] text-right">
                          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">Last Request</p>
                          <p className="mt-2 font-body text-sm text-on-surface-variant">
                            {service.lastRequestedAt ? formatDateTime(service.lastRequestedAt) : 'No bookings yet'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="xl:col-span-5 space-y-6">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-primary">Schedule</p>
                  <h2 className="mt-3 font-display text-4xl font-bold uppercase tracking-tighter">Next 14 Days Load</h2>
                </div>

                <div className="space-y-4">
                  {dashboard.scheduleLoad.length === 0 ? (
                    <div className="border border-dashed border-outline-variant bg-surface-container-low p-8 font-body text-on-surface-variant">
                      No upcoming sessions are currently scheduled in the next 14 days.
                    </div>
                  ) : (
                    dashboard.scheduleLoad.map((day) => (
                      <div key={day.day} className="border border-outline-variant bg-surface p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-display text-2xl font-bold uppercase tracking-tighter">{formatScheduleDay(day.day)}</p>
                            <p className="mt-2 font-mono text-xs uppercase tracking-[0.22em] text-on-surface-variant">{day.day}</p>
                          </div>
                          <div className="border border-outline-variant px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">
                            {day.bookedMinutes} Min Booked
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-3 gap-3 font-mono text-xs uppercase tracking-[0.18em]">
                          <div className="border border-outline-variant px-4 py-3">
                            <div className="text-on-surface-variant">Total</div>
                            <div className="mt-2 text-on-surface">{day.totalSessions}</div>
                          </div>
                          <div className="border border-outline-variant px-4 py-3">
                            <div className="text-on-surface-variant">Confirmed</div>
                            <div className="mt-2 text-on-surface">{day.confirmedSessions}</div>
                          </div>
                          <div className="border border-outline-variant px-4 py-3">
                            <div className="text-on-surface-variant">Pending</div>
                            <div className="mt-2 text-on-surface">{day.pendingSessions}</div>
                          </div>
                        </div>

                        <p className="mt-4 font-body text-sm text-on-surface-variant">
                          Services booked: {day.services.join(', ')}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-primary">Upcoming</p>
                  <h2 className="mt-3 font-display text-4xl font-bold uppercase tracking-tighter">Live Schedule Queue</h2>
                </div>

                <div className="space-y-4">
                  {dashboard.upcomingSchedule.length === 0 ? (
                    <div className="border border-dashed border-outline-variant bg-surface-container-low p-8 font-body text-on-surface-variant">
                      No upcoming pending or confirmed sessions yet.
                    </div>
                  ) : (
                    dashboard.upcomingSchedule.map((booking) => (
                      <div key={booking.id} className="border border-outline-variant bg-surface p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="font-display text-2xl font-bold uppercase tracking-tighter">{booking.service.title}</p>
                            <p className="mt-2 font-body text-sm text-on-surface-variant">
                              {booking.clientName} • {booking.clientEmail}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <StatusChip label={booking.status} />
                            <StatusChip label={booking.paymentStatus} />
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 font-body text-sm text-on-surface-variant">
                          <div>
                            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">Session Time</span>
                            <p className="mt-2 text-on-surface">{formatDateTime(booking.bookingDateTime, booking.clientTimezone || DEFAULT_TIMEZONE)}</p>
                          </div>
                          <div>
                            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">Session Details</span>
                            <p className="mt-2 text-on-surface">
                              {booking.service.sessionMode} • {booking.service.durationMin} Min • {formatCurrency(booking.amount)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                          <p className="font-body text-sm text-on-surface-variant">
                            Primary focus: {booking.keyConcern || 'No focus submitted yet'}
                          </p>
                          {booking.meetLink && (
                            <a
                              href={booking.meetLink}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono text-xs uppercase tracking-[0.2em] text-primary hover:underline"
                            >
                              Open Join Link
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-primary">Bookings</p>
                  <h2 className="mt-3 font-display text-4xl font-bold uppercase tracking-tighter">Recent Intake Activity</h2>
                </div>

                <div className="space-y-4">
                  {dashboard.recentBookings.length === 0 ? (
                    <div className="border border-dashed border-outline-variant bg-surface-container-low p-8 font-body text-on-surface-variant">
                      No bookings have been captured yet.
                    </div>
                  ) : (
                    dashboard.recentBookings.map((booking) => (
                      <div key={booking.id} className="border border-outline-variant bg-surface p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="font-display text-2xl font-bold uppercase tracking-tighter">{booking.clientName}</p>
                            <p className="mt-2 font-body text-sm text-on-surface-variant">
                              {booking.service.title} • Created {formatDateTime(booking.createdAt)}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <StatusChip label={booking.status} />
                            <StatusChip label={booking.paymentStatus} />
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">Contact</p>
                            <p className="mt-2 font-body text-on-surface">{booking.clientEmail}</p>
                            <p className="mt-1 font-body text-on-surface-variant">{booking.clientPhone}</p>
                          </div>
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">Session</p>
                            <p className="mt-2 font-body text-on-surface">{formatDateTime(booking.bookingDateTime, booking.clientTimezone || DEFAULT_TIMEZONE)}</p>
                            <p className="mt-1 font-body text-on-surface-variant">
                              {booking.birthPlace || 'Birth place not provided'}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 border border-outline-variant bg-surface-container-low px-4 py-4">
                          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">Primary Question</p>
                          <p className="mt-3 font-body text-on-surface">
                            {booking.keyConcern || 'No primary question captured for this booking.'}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
