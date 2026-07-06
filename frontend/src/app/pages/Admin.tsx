import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  Bot,
  CalendarDays,
  IndianRupee,
  Lock,
  LogOut,
  MailCheck,
  PackageSearch,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Users,
  Workflow,
} from "lucide-react";
import { fetchAdminDashboard, fetchAutomationStatus, triggerInventoryPoll } from "../../lib/api";

const DEFAULT_TIMEZONE = "Asia/Kolkata";

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
type AutomationRun = {
  id: string;
  type: string;
  status: string;
  source: string | null;
  recipient: string | null;
  subject: string | null;
  errorStr: string | null;
  createdAt: string;
};

type InventoryRecord = {
  id: string;
  sku: string;
  name: string;
  totalWeightGrams: number;
  reservedGrams: number;
  lowStockThreshold: number;
  availableGrams: number;
  isLowStock: boolean;
  lastAlertedAt: string | null;
};

type AutomationStatus = {
  config: {
    orderWebhookUrl: string | null;
    ollamaBaseUrl: string | null;
    ollamaModel: string;
    emailProvider: string;
    backendOrderWebhookPath: string;
    inventoryPollPath: string;
  };
  recentRuns: AutomationRun[];
  inventory: InventoryRecord[];
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDateTime = (dateTime: string, timeZone = DEFAULT_TIMEZONE) => {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone,
    }).format(new Date(dateTime));
  } catch {
    return new Date(dateTime).toLocaleString();
  }
};

const formatScheduleDay = (day: string) => {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone: DEFAULT_TIMEZONE,
    }).format(new Date(`${day}T00:00:00+05:30`));
  } catch {
    return day;
  }
};

const statusTone = (status: string) => {
  switch (status) {
    case "CONFIRMED":
    case "SUCCESS":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "PENDING":
      return "border-[#E5BE90] bg-[#FFF5EA] text-[#C56D45]";
    case "CANCELLED":
    case "FAILED":
      return "border-red-200 bg-red-50 text-red-700";
    default:
      return "border-[#E5BE90]/40 bg-white text-[#7A7A7A]";
  }
};

function MetricCard({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-[1.5rem] sm:rounded-[2rem] bg-white p-5 sm:p-6 shadow-[0_8px_32px_rgba(88,88,88,0.04)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7A7A7A]">{label}</p>
          <p className="mt-3 text-2xl sm:text-3xl font-semibold text-[#585858]">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF5EA]">
          <Icon className="h-6 w-6 text-[#E84C3D]" />
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-[#7A7A7A]">{note}</p>
    </div>
  );
}


function AutomationPanel({
  status,
  onPollInventory,
  isPolling,
}: {
  status: AutomationStatus | null;
  onPollInventory: () => void;
  isPolling: boolean;
}) {
  if (!status) return null;

  const connectedSteps = [
    { icon: Workflow, label: "Order Webhook", value: status.config.orderWebhookUrl || status.config.backendOrderWebhookPath },
    { icon: Bot, label: "LangGraph/Ollama", value: `${status.config.ollamaModel} at ${status.config.ollamaBaseUrl || "not configured"}` },
    { icon: MailCheck, label: "Email Provider", value: status.config.emailProvider.toUpperCase() },
    { icon: PackageSearch, label: "Inventory Poll", value: status.config.inventoryPollPath },
  ];

  return (
    <section className="space-y-6 rounded-[1.75rem] sm:rounded-[3rem] bg-white p-5 sm:p-8 shadow-[0_8px_32px_rgba(88,88,88,0.03)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C56D45]">Automation</p>
          <h2 className="mt-3 text-3xl font-semibold text-[#585858]">LangGraph, Ollama, email, and inventory flow</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#7A7A7A]">
            Orders enter directly through the LangGraph webhook. The graph reads the order items array, calls Ollama for the thank-you email, sends through the configured email provider, and records the run in Supabase/Postgres. A separate LangGraph inventory graph checks BulkInventory and alerts when available grams fall below threshold.
          </p>
        </div>
        <button type="button" onClick={onPollInventory} disabled={isPolling} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E84C3D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#C0392B] disabled:cursor-not-allowed disabled:opacity-60">
          <PackageSearch className="h-4 w-4" />
          {isPolling ? "Polling..." : "Poll Inventory"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {connectedSteps.map(({ icon: Icon, label, value }) => (
          <article key={label} className="rounded-[1.5rem] bg-[#FFF5EA] p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm"><Icon className="h-5 w-5 text-[#E84C3D]" /></div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#7A7A7A]">{label}</p>
            <p className="mt-2 break-words text-sm font-semibold text-[#585858]">{value}</p>
          </article>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-[1.5rem] bg-[#FFF5EA] p-5">
          <h3 className="text-xl font-semibold text-[#585858]">Bulk inventory</h3>
          <div className="mt-4 space-y-3">
            {status.inventory.length === 0 ? <p className="text-sm text-[#7A7A7A]">No BulkInventory rows found yet.</p> : status.inventory.map((item) => (
              <div key={item.id} className="rounded-[1.25rem] bg-white px-4 py-3">
                <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold text-[#585858]">{item.name}</p><p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A]">{item.sku}</p></div><StatusChip label={item.isLowStock ? "LOW" : "OK"} /></div>
                <p className="mt-3 text-sm text-[#7A7A7A]">{item.availableGrams}g available from {item.totalWeightGrams}g total, threshold {item.lowStockThreshold}g.</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] bg-[#FFF5EA] p-5">
          <h3 className="text-xl font-semibold text-[#585858]">Recent automation runs</h3>
          <div className="mt-4 space-y-3">
            {status.recentRuns.length === 0 ? <p className="text-sm text-[#7A7A7A]">No automation runs have been recorded yet.</p> : status.recentRuns.map((run) => (
              <div key={run.id} className="rounded-[1.25rem] bg-white px-4 py-3">
                <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-semibold text-[#585858]">{run.type}</p><p className="mt-1 text-sm text-[#7A7A7A]">{run.recipient || run.source || "System"}</p></div><StatusChip label={run.status} /></div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#7A7A7A]">{formatDateTime(run.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
function StatusChip({ label }: { label: string }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${statusTone(
        label
      )}`}
    >
      {label}
    </span>
  );
}

export function Admin() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState("");
  const [activePassword, setActivePassword] = useState("");
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [automationStatus, setAutomationStatus] = useState<AutomationStatus | null>(null);
  const [isLocked, setIsLocked] = useState(true);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPollingInventory, setIsPollingInventory] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    if (isLocked) {
      const timer = window.setTimeout(() => inputRef.current?.focus(), 120);
      return () => window.clearTimeout(timer);
    }
  }, [isLocked]);

  const loadDashboard = async (adminPassword: string, mode: "unlock" | "refresh") => {
    const trimmedPassword = adminPassword.trim();

    if (!trimmedPassword) {
      setAuthError("Enter the admin password to continue.");
      return;
    }

    if (mode === "unlock") {
      setIsUnlocking(true);
      setAuthError(null);
    } else {
      setIsRefreshing(true);
      setPageError(null);
    }

    try {
      const [response, automationResponse] = await Promise.all([
        fetchAdminDashboard(trimmedPassword),
        fetchAutomationStatus(trimmedPassword),
      ]);
      setDashboard(response.data as AdminDashboard);
      setAutomationStatus(automationResponse.data as AutomationStatus);
      setActivePassword(trimmedPassword);
      setIsLocked(false);
      setAuthError(null);
      setPageError(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load the admin dashboard right now.";

      if (mode === "unlock") {
        setDashboard(null);
        setAutomationStatus(null);
        setAuthError(message);
      } else {
        setPageError(message);
      }
    } finally {
      if (mode === "unlock") {
        setIsUnlocking(false);
      } else {
        setIsRefreshing(false);
      }
    }
  };

  const handleUnlock = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await loadDashboard(password, "unlock");
  };


  const handlePollInventory = async () => {
    if (!activePassword) return;

    setIsPollingInventory(true);
    setPageError(null);

    try {
      await triggerInventoryPoll(activePassword);
      const response = await fetchAutomationStatus(activePassword);
      setAutomationStatus(response.data as AutomationStatus);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to poll inventory right now.";
      setPageError(message);
    } finally {
      setIsPollingInventory(false);
    }
  };
  const handleLock = () => {
    setIsLocked(true);
    setPassword("");
    setActivePassword("");
    setDashboard(null);
    setAutomationStatus(null);
    setAuthError(null);
    setPageError(null);
  };

  const summaryCards = dashboard
    ? [
        {
          icon: IndianRupee,
          label: "Revenue Collected",
          value: formatCurrency(dashboard.summary.revenueCollected),
          note: "Successful payments recorded through the live booking flow.",
        },
        {
          icon: ShieldCheck,
          label: "Confirmed Sessions",
          value: String(dashboard.summary.bookingsConfirmed),
          note: "Bookings currently secured on the calendar and in the database.",
        },
        {
          icon: RefreshCw,
          label: "Pending Payments",
          value: String(dashboard.summary.pendingBookings),
          note: "Sessions initiated but not fully completed at checkout yet.",
        },
        {
          icon: CalendarDays,
          label: "Upcoming Schedule",
          value: String(dashboard.summary.upcomingSessions),
          note: "Future pending and confirmed sessions in the next active window.",
        },
        {
          icon: Users,
          label: "Unique Customers",
          value: String(dashboard.summary.uniqueCustomers),
          note: "Distinct client email addresses captured through bookings.",
        },
        {
          icon: TrendingUp,
          label: "Active Services",
          value: String(dashboard.summary.totalServices),
          note: "Services currently available through the public booking flow.",
        },
      ]
    : [];

  return (
    <div className="relative space-y-10 pb-8">
      <section className="relative overflow-hidden rounded-[1.75rem] sm:rounded-[3rem] bg-white px-5 py-8 sm:px-8 sm:py-10 shadow-[0_8px_32px_rgba(88,88,88,0.03)] md:px-12 md:py-14">
        <div className="absolute -left-16 top-0 h-64 w-64 rounded-full bg-[#E5BE90]/20 blur-[100px]" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#E84C3D]/12 blur-[120px]" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF5EA] px-4 py-2 text-sm font-medium text-[#C56D45] shadow-sm">
              <Lock className="h-4 w-4" />
              Protected Admin Dashboard
            </div>
            <h1 className="mt-6 text-3xl font-semibold leading-tight text-[#585858] sm:text-4xl md:text-6xl">
              Live booking analytics and client activity.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#7A7A7A] md:text-lg">
              Review revenue, demand, schedule pressure, and recent intake submissions in one place. The dashboard stays
              locked until the correct admin password is entered.
            </p>
          </div>

          {!isLocked && (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void loadDashboard(activePassword, "refresh")}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 rounded-full border border-[#E5BE90]/50 bg-[#FFF5EA] px-5 py-3 text-sm font-semibold text-[#585858] transition hover:border-[#E84C3D]/40 hover:text-[#E84C3D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </button>
              <button
                type="button"
                onClick={handleLock}
                className="inline-flex items-center gap-2 rounded-full bg-[#E84C3D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#C0392B]"
              >
                <LogOut className="h-4 w-4" />
                Lock Dashboard
              </button>
            </div>
          )}
        </div>
      </section>

      {pageError && !isLocked && (
        <div className="flex items-start gap-3 rounded-[2rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>{pageError}</div>
        </div>
      )}

      <div className={`${isLocked ? "pointer-events-none select-none blur-sm" : ""} transition duration-200`}>
        {!dashboard ? (
          <section className="rounded-[1.75rem] sm:rounded-[3rem] bg-[#FDF3E6] px-5 py-10 sm:px-8 sm:py-12 text-center shadow-inner md:px-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
              <Lock className="h-10 w-10 text-[#E84C3D]" />
            </div>
            <h2 className="mt-6 text-3xl font-semibold text-[#585858]">Admin access required</h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#7A7A7A]">
              Enter the admin password to view live bookings, client details, service demand, and schedule load.
            </p>
          </section>
        ) : (
          <div className="space-y-10">
            <AutomationPanel
              status={automationStatus}
              onPollInventory={() => void handlePollInventory()}
              isPolling={isPollingInventory}
            />

            <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {summaryCards.map((card) => (
                <MetricCard key={card.label} icon={card.icon} label={card.label} value={card.value} note={card.note} />
              ))}
            </section>

            <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.3fr_0.9fr]">
              <div className="space-y-6 rounded-[1.75rem] sm:rounded-[3rem] bg-white p-5 sm:p-8 shadow-[0_8px_32px_rgba(88,88,88,0.03)]">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C56D45]">Demand</p>
                    <h2 className="mt-3 text-3xl font-semibold text-[#585858]">Services customers request</h2>
                  </div>
                  <p className="text-sm text-[#7A7A7A]">Total bookings: {dashboard.summary.totalBookings}</p>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {dashboard.serviceDemand.map((service) => (
                    <article key={service.id} className="rounded-[1.5rem] sm:rounded-[2rem] bg-[#FFF5EA] p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl sm:text-2xl font-semibold text-[#585858]">{service.title}</h3>
                          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#7A7A7A]">
                            {service.sessionMode} • {service.durationMin} min • {formatCurrency(service.price)}
                          </p>
                        </div>
                        <div className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#C56D45] shadow-sm">
                          {service.totalRequests} requests
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-[1.5rem] bg-white px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A]">Confirmed</p>
                          <p className="mt-2 text-lg font-semibold text-[#585858]">{service.confirmedRequests}</p>
                        </div>
                        <div className="rounded-[1.5rem] bg-white px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A]">Pending</p>
                          <p className="mt-2 text-lg font-semibold text-[#585858]">{service.pendingRequests}</p>
                        </div>
                        <div className="rounded-[1.5rem] bg-white px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A]">Cancelled</p>
                          <p className="mt-2 text-lg font-semibold text-[#585858]">{service.cancelledRequests}</p>
                        </div>
                        <div className="rounded-[1.5rem] bg-white px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A]">Failed</p>
                          <p className="mt-2 text-lg font-semibold text-[#585858]">{service.failedRequests}</p>
                        </div>
                      </div>

                      <div className="mt-5 flex items-end justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A]">Revenue</p>
                          <p className="mt-2 text-2xl font-semibold text-[#585858]">{formatCurrency(service.revenueCollected)}</p>
                        </div>
                        <div className="max-w-[220px] text-right text-sm text-[#7A7A7A]">
                          {service.lastRequestedAt ? formatDateTime(service.lastRequestedAt) : "No bookings yet"}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="space-y-6 rounded-[1.75rem] sm:rounded-[3rem] bg-white p-5 sm:p-8 shadow-[0_8px_32px_rgba(88,88,88,0.03)]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C56D45]">Schedule</p>
                  <h2 className="mt-3 text-3xl font-semibold text-[#585858]">Next 14 days load</h2>
                </div>

                <div className="space-y-4">
                  {dashboard.scheduleLoad.length === 0 ? (
                    <div className="rounded-[2rem] bg-[#FFF5EA] px-6 py-8 text-[#7A7A7A]">
                      No upcoming sessions are currently scheduled in the next 14 days.
                    </div>
                  ) : (
                    dashboard.scheduleLoad.map((day) => (
                      <article key={day.day} className="rounded-[1.5rem] sm:rounded-[2rem] bg-[#FFF5EA] p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-2xl font-semibold text-[#585858]">{formatScheduleDay(day.day)}</p>
                            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A]">{day.day}</p>
                          </div>
                          <div className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#C56D45] shadow-sm">
                            {day.bookedMinutes} min booked
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                          <div className="rounded-[1.25rem] bg-white px-3 py-3 text-center">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A7A7A]">Total</p>
                            <p className="mt-2 text-lg font-semibold text-[#585858]">{day.totalSessions}</p>
                          </div>
                          <div className="rounded-[1.25rem] bg-white px-3 py-3 text-center">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A7A7A]">Confirmed</p>
                            <p className="mt-2 text-lg font-semibold text-[#585858]">{day.confirmedSessions}</p>
                          </div>
                          <div className="rounded-[1.25rem] bg-white px-3 py-3 text-center">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A7A7A]">Pending</p>
                            <p className="mt-2 text-lg font-semibold text-[#585858]">{day.pendingSessions}</p>
                          </div>
                        </div>

                        <p className="mt-4 text-sm leading-relaxed text-[#7A7A7A]">Services booked: {day.services.join(", ")}</p>
                      </article>
                    ))
                  )}
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-8 xl:grid-cols-2">
              <div className="space-y-6 rounded-[1.75rem] sm:rounded-[3rem] bg-white p-5 sm:p-8 shadow-[0_8px_32px_rgba(88,88,88,0.03)]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C56D45]">Upcoming</p>
                  <h2 className="mt-3 text-3xl font-semibold text-[#585858]">Live schedule queue</h2>
                </div>

                <div className="space-y-4">
                  {dashboard.upcomingSchedule.length === 0 ? (
                    <div className="rounded-[2rem] bg-[#FFF5EA] px-6 py-8 text-[#7A7A7A]">
                      No upcoming pending or confirmed sessions yet.
                    </div>
                  ) : (
                    dashboard.upcomingSchedule.map((booking) => (
                      <article key={booking.id} className="rounded-[1.5rem] sm:rounded-[2rem] bg-[#FFF5EA] p-5 sm:p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="text-xl sm:text-2xl font-semibold text-[#585858]">{booking.service.title}</p>
                            <p className="mt-2 break-all text-sm text-[#7A7A7A]">
                              {booking.clientName} • {booking.clientEmail}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <StatusChip label={booking.status} />
                            <StatusChip label={booking.paymentStatus} />
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                          <div className="rounded-[1.5rem] bg-white px-4 py-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A]">Session Time</p>
                            <p className="mt-2 text-[#585858]">{formatDateTime(booking.bookingDateTime, booking.clientTimezone || DEFAULT_TIMEZONE)}</p>
                          </div>
                          <div className="rounded-[1.5rem] bg-white px-4 py-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A]">Session Details</p>
                            <p className="mt-2 text-[#585858]">
                              {booking.service.sessionMode} • {booking.service.durationMin} min • {formatCurrency(booking.amount)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 text-sm">
                          <p className="text-[#7A7A7A]">Primary focus: {booking.keyConcern || "No focus submitted yet"}</p>
                          {booking.meetLink && (
                            <a
                              href={booking.meetLink}
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold text-[#E84C3D] transition hover:text-[#C0392B]"
                            >
                              Open join link
                            </a>
                          )}
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-6 rounded-[1.75rem] sm:rounded-[3rem] bg-white p-5 sm:p-8 shadow-[0_8px_32px_rgba(88,88,88,0.03)]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#C56D45]">Bookings</p>
                  <h2 className="mt-3 text-3xl font-semibold text-[#585858]">Recent intake activity</h2>
                </div>

                <div className="space-y-4">
                  {dashboard.recentBookings.length === 0 ? (
                    <div className="rounded-[2rem] bg-[#FFF5EA] px-6 py-8 text-[#7A7A7A]">
                      No bookings have been captured yet.
                    </div>
                  ) : (
                    dashboard.recentBookings.map((booking) => (
                      <article key={booking.id} className="rounded-[1.5rem] sm:rounded-[2rem] bg-[#FFF5EA] p-5 sm:p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="text-xl sm:text-2xl font-semibold text-[#585858]">{booking.clientName}</p>
                            <p className="mt-2 text-sm text-[#7A7A7A]">
                              {booking.service.title} • Created {formatDateTime(booking.createdAt)}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <StatusChip label={booking.status} />
                            <StatusChip label={booking.paymentStatus} />
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="rounded-[1.5rem] bg-white px-4 py-4 text-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A]">Contact</p>
                            <p className="mt-2 break-all text-[#585858]">{booking.clientEmail}</p>
                            <p className="mt-1 text-[#7A7A7A]">{booking.clientPhone}</p>
                          </div>
                          <div className="rounded-[1.5rem] bg-white px-4 py-4 text-sm">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A]">Session</p>
                            <p className="mt-2 text-[#585858]">
                              {formatDateTime(booking.bookingDateTime, booking.clientTimezone || DEFAULT_TIMEZONE)}
                            </p>
                            <p className="mt-1 text-[#7A7A7A]">{booking.birthPlace || "Birth place not provided"}</p>
                          </div>
                        </div>

                        <div className="mt-5 rounded-[1.5rem] bg-white px-4 py-4 text-sm">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A]">Primary Question</p>
                          <p className="mt-3 text-[#585858]">
                            {booking.keyConcern || "No primary question captured for this booking."}
                          </p>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </div>
            </section>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isLocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#585858]/35 px-4 sm:px-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md rounded-[1.75rem] sm:rounded-[2.5rem] bg-white p-6 sm:p-8 shadow-[0_24px_80px_rgba(88,88,88,0.18)]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF5EA]">
                <ShieldCheck className="h-7 w-7 text-[#E84C3D]" />
              </div>
              <h2 className="mt-6 text-2xl sm:text-3xl font-semibold text-[#585858]">Admin password required</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#7A7A7A]">
                Enter the admin password to unlock live analytics, booking details, and schedule insights.
              </p>

              <form className="mt-8 space-y-4" onSubmit={handleUnlock}>
                <div>
                  <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-[#585858]">
                    Password
                  </label>
                  <input
                    id="admin-password"
                    ref={inputRef}
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter admin password"
                    className="w-full rounded-[1.5rem] bg-[#FFF5EA] px-5 py-4 text-[#585858] outline-none transition focus:ring-2 focus:ring-[#E84C3D]/30"
                    autoComplete="current-password"
                  />
                </div>

                {authError && (
                  <div className="flex items-start gap-3 rounded-[1.5rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>{authError}</div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isUnlocking}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#E84C3D] px-5 py-4 text-base font-semibold text-white transition hover:bg-[#C0392B] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Lock className="h-4 w-4" />
                  {isUnlocking ? "Unlocking..." : "Unlock Dashboard"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}




