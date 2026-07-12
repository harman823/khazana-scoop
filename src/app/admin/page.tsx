import Link from "next/link";
import { PageChrome } from "@/components/page-chrome";
import { AdminActionTile, AdminMetricCard, AdminPanel, AdminStatusBadge } from "@/components/storefront-admin";
import { listInventory, listOrders } from "@/lib/production-store";

export const dynamic = "force-dynamic";

export default async function AdminPage(): Promise<React.ReactElement> {
  const [orders, inventoryItems] = await Promise.all([listOrders(), listInventory()]);
  const lowStockItems = inventoryItems.filter((item) => item.availableGrams <= item.lowStockThreshold);
  const scoopedCount = orders.filter((order) => order.status === "Scooped").length;
  const shippedCount = orders.filter((order) => order.status === "Shipped").length;

  return (
    <PageChrome
      title="Fulfillment dashboard"
      subtitle="Pack orders, attach short-form video links, and keep bulk inventory from overselling during live drops."
    >
      <div className="grid gap-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AdminMetricCard detail="Every customer order currently in the system." label="Orders" value={String(orders.length)} />
          <AdminMetricCard detail="Scoops packed and ready for approval or shipment." label="Scooped" tone="rose" value={String(scoopedCount)} />
          <AdminMetricCard detail="Orders already handed off to delivery." label="Shipped" tone="amber" value={String(shippedCount)} />
          <AdminMetricCard detail="Bulk ingredients or fillers under the safety line." label="Low stock" tone="slate" value={String(lowStockItems.length)} />
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <AdminPanel
            action={
              <Link className="button-secondary" href="/admin/fulfillment">
                Open operations board
              </Link>
            }
            description="Open the next order, check scoop status, and keep the packing line moving without losing context."
            title="Packing queue"
          >
            <div className="grid gap-4">
              {orders.map((order) => (
                <Link
                  className="rounded-[26px] border border-[#ebe2d8] bg-[#fffdfa] p-5 transition hover:-translate-y-0.5 hover:border-[#bde5df] hover:bg-[#f9fffe]"
                  href={`/admin/orders/${order.id}`}
                  key={order.id}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xl font-black tracking-[-0.03em] text-[#35534d]">Order #{order.id}</p>
                      <p className="mt-2 text-sm leading-6 text-[#6a8079]">
                        {order.createdAt} · {order.tierName} · {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div className="flex flex-col items-start gap-3 sm:items-end">
                      <AdminStatusBadge
                        label={order.status}
                        tone={order.status === "Shipped" ? "amber" : order.status === "Scooped" ? "rose" : "teal"}
                      />
                      <span className="text-xs font-black uppercase tracking-[0.16em] text-[#18a59e]">Open order</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </AdminPanel>

          <div className="grid gap-6">
            <section className="storefront-subtle-panel p-6 sm:p-8">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#6b817b]">Inventory pulse</p>
              <h2
                className="mt-3 text-4xl font-black tracking-[-0.05em] text-[#31514b]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Bulk stock needs a quick check.
              </h2>
              <div className="mt-6 space-y-3">
                {lowStockItems.length > 0 ? (
                  lowStockItems.slice(0, 4).map((item) => (
                    <div className="rounded-[22px] bg-white/85 p-4 shadow-[0_14px_34px_rgba(118,140,134,0.10)]" key={item.id}>
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-black text-[#35534d]">{item.itemName}</span>
                        <AdminStatusBadge label="Low stock" tone="amber" />
                      </div>
                      <p className="mt-2 text-sm text-[#6a8079]">
                        {item.availableGrams}g available · threshold {item.lowStockThreshold}g
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[22px] bg-white/85 p-4 shadow-[0_14px_34px_rgba(118,140,134,0.10)]">
                    <p className="font-black text-[#35534d]">All tracked inventory is sitting above the low-stock threshold.</p>
                  </div>
                )}
              </div>
            </section>

            <AdminPanel title="Admin links">
              <div className="grid gap-4">
                <AdminActionTile
                  body="Review the full queue, compare shipped vs scooped counts, and monitor progress."
                  href="/admin/fulfillment"
                  label="Orders, packed & shipped"
                />
                <AdminActionTile
                  body="Check grams on hand, reserved grams, and which items are nearing the warning line."
                  href="/admin/inventory"
                  label="Manage inventory"
                />
                <AdminActionTile
                  body="Browse the Supabase-backed tables without dropping into SQL or the Prisma schema."
                  href="/admin/database"
                  label="View database tables"
                />
                <AdminActionTile
                  body="Preview the customer-facing order details route with its current order state and totals."
                  href="/orders/MS-12487"
                  label="Preview customer order"
                />
              </div>
            </AdminPanel>
          </div>
        </div>
      </div>
    </PageChrome>
  );
}
