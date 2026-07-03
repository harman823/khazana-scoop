"use client";

import Link from "next/link";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Download,
  Gift,
  Heart,
  Home,
  MapPin,
  PackageCheck,
  RefreshCw,
  Search,
  Settings,
  SlidersHorizontal,
  Star,
  Trash2,
  Truck,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { formatMoney } from "@/lib/pricing";
import type { CustomerOrder, UserProfile } from "@/lib/types";

type OrdersOverviewProps = {
  orders: CustomerOrder[];
  user: UserProfile;
};

const quickLinks = [
  { label: "Profile", icon: UserRound, tone: "pink" },
  { label: "Gifts", icon: Gift, tone: "teal" },
  { label: "Wallet", icon: WalletCards, tone: "yellow" },
];

const primaryNav = [
  { label: "My orders", icon: PackageCheck, active: true },
  { label: "Reviews", icon: Star },
  { label: "Delivery addresses", icon: MapPin },
  { label: "Recently viewed", icon: Search },
  { label: "Favourite items", icon: Heart },
];

export function OrdersOverview({ orders, user }: OrdersOverviewProps): React.ReactElement {
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const displayOrders = useMemo(() => orders.slice(0, 5), [orders]);

  return (
    <section className="orders-overview-section">
      <div className="orders-overview-container">
        <nav className="orders-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">
            <Home size={16} />
            Home
          </Link>
          <ChevronRight size={16} />
          <Link href="/account">My account</Link>
          <ChevronRight size={16} />
          <span>All orders</span>
        </nav>

        <h1 className="orders-page-title">My orders</h1>

        <div className="orders-layout">
          <aside className="orders-account-sidebar" aria-label="Account navigation">
            <details className="orders-account-switcher">
              <summary>
                <span className="orders-avatar">{user.name.slice(0, 1).toUpperCase()}</span>
                <span>
                  <strong>{user.name} (Personal)</strong>
                  <small>{user.email}</small>
                </span>
                <ChevronDown size={20} />
              </summary>
              <div className="orders-account-menu">
                <span className="orders-company-logo">MS</span>
                <span>
                  <strong>Mystery Studio (Company)</strong>
                  <small>team@mysteryscoop.com</small>
                </span>
              </div>
            </details>

            <div className="orders-quick-grid">
              {quickLinks.map(({ icon: Icon, label, tone }) => (
                <Link className={`orders-quick-tile orders-quick-${tone}`} href="/profile" key={label}>
                  <span>
                    <Icon size={20} />
                  </span>
                  {label}
                </Link>
              ))}
            </div>

            <nav className="orders-nav-list" aria-label="Primary account links">
              {primaryNav.map(({ active, icon: Icon, label }) => (
                <Link className={active ? "is-active" : ""} href="/orders" key={label}>
                  <Icon size={24} />
                  {label}
                </Link>
              ))}
            </nav>

            <nav className="orders-nav-list orders-nav-secondary" aria-label="Secondary account links">
              <Link href="/profile">
                <Settings size={24} />
                Settings
              </Link>
              <Link className="orders-logout-link" href="/login">
                <X size={24} />
                Log out
              </Link>
            </nav>
          </aside>

          <div className="orders-content-area">
            <div className="orders-toolbar">
              <form className="orders-search-form" action="/orders">
                <Search size={18} />
                <input aria-label="Search by Order ID" name="q" placeholder="Search by Order ID" />
                <button type="submit">Search</button>
              </form>

              <div className="orders-filter-cluster">
                <details className="orders-menu">
                  <summary>
                    <SlidersHorizontal size={16} />
                    Filter by: Status
                    <ChevronDown size={16} />
                  </summary>
                  <div className="orders-menu-popover orders-status-menu">
                    {["Confirmed", "Pre-order", "In transit", "Cancelled"].map((status) => (
                      <button type="button" key={status}>
                        <span className={`orders-status-dot ${statusClass(status)}`} />
                        {status}
                      </button>
                    ))}
                  </div>
                </details>

                <details className="orders-menu">
                  <summary>
                    Last 7 days
                    <ChevronDown size={16} />
                  </summary>
                  <div className="orders-menu-popover orders-date-menu">
                    <button type="button">Last 7 days</button>
                    <button type="button">Last 30 days</button>
                    <button type="button">This year</button>
                  </div>
                </details>
              </div>
            </div>

            <div className="orders-card-stack">
              {displayOrders.length > 0 ? (
                displayOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    user={user}
                    onDelete={() => setDeleteOrderId(order.id)}
                  />
                ))
              ) : (
                <div className="orders-empty-card">
                  <PackageCheck size={34} />
                  <h2>No orders yet</h2>
                  <p>Build your first mystery scoop and every status update will appear here.</p>
                  <Link className="button-primary" href="/mystery-scoops">Build my scoop</Link>
                </div>
              )}
            </div>

            {displayOrders.length > 0 ? (
              <nav className="orders-pager" aria-label="Orders pagination">
                <button type="button" aria-label="Previous page">
                  <ChevronLeft size={16} />
                </button>
                {[1, 2, 3].map((page) => (
                  <button className={page === 1 ? "is-active" : ""} type="button" key={page}>
                    {page}
                  </button>
                ))}
                <button type="button" aria-label="Next page">
                  <ChevronRight size={16} />
                </button>
              </nav>
            ) : null}
          </div>
        </div>
      </div>

      <DeleteOrderModal
        orderId={deleteOrderId}
        onClose={() => setDeleteOrderId(null)}
      />
    </section>
  );
}

function OrderCard({
  onDelete,
  order,
  user,
}: {
  onDelete: () => void;
  order: CustomerOrder;
  user: UserProfile;
}): React.ReactElement {
  const settled = order.status === "Delivered" || order.status === "Cancelled" || order.status === "Scooped" || order.status === "Shipped";

  return (
    <article className="orders-card">
      <div className="orders-card-header">
        <div>
          <p>
            <span>Order ID:</span>{" "}
            <Link href={`/orders/${order.id}`}>#{order.id}</Link>{" "}
            <StatusBadge status={order.status} />
          </p>
          <Link className="orders-invoice-link" href={`/orders/${order.id}`}>
            <Download size={20} />
            Download invoice
          </Link>
        </div>
        <div className="orders-action-group">
          {settled ? (
            <Link className="orders-action-button orders-brand-button" href="/mystery-scoops">
              <RefreshCw size={16} />
              Order again
            </Link>
          ) : (
            <>
              <button className="orders-action-button orders-danger-button" type="button" onClick={onDelete}>
                Cancel order
              </button>
              <Link className="orders-action-button orders-neutral-button" href="/tracking">
                <Truck size={16} />
                Track order
              </Link>
            </>
          )}
          <Link className="orders-action-button orders-neutral-button" href={`/orders/${order.id}`}>
            Order details
          </Link>
        </div>
      </div>

      <dl className="orders-meta-row">
        <div>
          <dt>Order date:</dt>
          <dd>{order.createdAt}</dd>
        </div>
        <div>
          <dt>Email:</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt>Payment method:</dt>
          <dd>
            <CreditCard size={18} />
            Card ending 4242
          </dd>
        </div>
        <div>
          <dt>Total:</dt>
          <dd>{formatMoney(order.totalCents)}</dd>
        </div>
      </dl>

      <div className={`orders-status-alert ${settled ? "orders-alert-neutral" : "orders-alert-warning"}`}>
        <PackageCheck size={16} />
        <span>
          {settled ? "Updated on" : "Expected delivery on"}{" "}
          <strong>{statusDateFor(order.createdAt, settled ? 3 : 7)}</strong>
        </span>
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: string }): React.ReactElement {
  return (
    <span className={`orders-status-badge ${statusClass(status)}`}>
      <PackageCheck size={12} />
      {status}
    </span>
  );
}

function DeleteOrderModal({
  onClose,
  orderId,
}: {
  onClose: () => void;
  orderId: string | null;
}): React.ReactElement | null {
  if (!orderId) return null;

  return (
    <div className="orders-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="delete-order-title">
      <div className="orders-delete-modal">
        <button className="orders-modal-close" type="button" aria-label="Close modal" onClick={onClose}>
          <X size={20} />
        </button>
        <span className="orders-modal-icon">
          <Trash2 size={32} />
        </span>
        <h2 id="delete-order-title">Cancel order #{orderId}?</h2>
        <p>This cannot be undone once the packing team confirms the cancellation.</p>
        <div className="orders-modal-actions">
          <button className="orders-action-button orders-neutral-button" type="button" onClick={onClose}>
            No, cancel
          </button>
          <button className="orders-action-button orders-danger-button" type="button" onClick={onClose}>
            Yes, delete
          </button>
        </div>
      </div>
    </div>
  );
}

function statusClass(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized.includes("cancel")) return "orders-status-danger";
  if (normalized.includes("transit") || normalized.includes("pending") || normalized.includes("approval")) return "orders-status-warning";
  if (normalized.includes("pre")) return "orders-status-brand";
  return "orders-status-success";
}

function statusDateFor(date: string, offsetDays: number): string {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return date;
  value.setDate(value.getDate() + offsetDays);
  return value.toISOString().slice(0, 10);
}
