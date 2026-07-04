import Link from "next/link";
import { Upload } from "lucide-react";
import { PageChrome } from "@/components/page-chrome";
import { AdminMetricCard, AdminPanel, AdminStatusBadge } from "@/components/storefront-admin";
import { listInventory, listOrders } from "@/lib/production-store";
import type { CustomerOrder } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminFulfillmentPage(): Promise<React.ReactElement> {
  const [orders, inventoryItems] = await Promise.all([listOrders(), listInventory()]);
  const pendingOrders = orders.filter((order) => order.status === "Pending");
  const approvalOrders = orders.filter((order) => order.status === "Awaiting Approval");
  const scoopedOrders = orders.filter((order) => order.status === "Scooped");
  const shippedOrders = orders.filter((order) => order.status === "Shipped");
  const lowStockCount = inventoryItems.filter((item) => item.availableGrams <= item.lowStockThreshold).length;

  return (
    <PageChrome
      title="Packing operations"
      subtitle="Review inventory health and today’s order progress across ordered, packed, scooped, and shipped scoops."
    >
      <div className="grid gap-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <AdminMetricCard detail="New orders that still need a fresh scoop prepared." label="Pending" value={String(pendingOrders.length)} />
          <AdminMetricCard detail="Orders waiting on customer approval before they move on." label="Awaiting approval" tone="rose" value={String(approvalOrders.length)} />
          <AdminMetricCard detail="Scoops packed and ready for final movement." label="Scooped" tone="teal" value={String(scoopedOrders.length)} />
          <AdminMetricCard detail="Parcels already handed off for delivery." label="Shipped" tone="amber" value={String(shippedOrders.length)} />
          <AdminMetricCard detail="Inventory lines that may slow down the next pack run." label="Low stock" tone="slate" value={String(lowStockCount)} />
        </section>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="storefront-subtle-panel p-6 sm:p-8">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#6b817b]">Today&apos;s packing</p>
            <h2
              className="mt-3 text-4xl font-black tracking-[-0.05em] text-[#31514b]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              The queue is moving cleanly.
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["Orders in flow", String(orders.length)],
                ["Packed / scooped", String(scoopedOrders.length)],
                ["Already shipped", String(shippedOrders.length)],
                ["Low stock alerts", String(lowStockCount)],
              ].map(([label, value]) => (
                <div className="rounded-[22px] bg-white/84 p-4 shadow-[0_14px_34px_rgba(118,140,134,0.10)]" key={label}>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#6b817b]">{label}</p>
                  <p className="mt-3 text-3xl font-black tracking-[-0.05em] text-[#35534d]">{value}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 flex items-center gap-3 rounded-[24px] bg-white/86 p-5 text-sm font-bold text-[#247b55] shadow-[0_14px_34px_rgba(118,140,134,0.10)]">
              <Upload size={18} /> Quality check: all good to go.
            </p>
          </section>

          <AdminPanel
            action={
              <Link className="button-secondary" href="/admin/inventory">
                Inspect inventory
              </Link>
            }
            description="Keep one eye on raw stock while orders move through the queue."
            title="Inventory overview"
          >
            <div className="overflow-x-auto">
              <table className="storefront-data-table min-w-[680px]">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>On hand</th>
                    <th>Reserved</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryItems.map((item) => {
                    const low = item.availableGrams <= item.lowStockThreshold;
                    return (
                      <tr key={item.id}>
                        <td className="font-black">{item.itemName}</td>
                        <td className="text-[#6a8079]">{item.category}</td>
                        <td>{item.onHandGrams}g</td>
                        <td>{item.reservedGrams}g</td>
                        <td>
                          <AdminStatusBadge label={low ? "Low stock" : "In stock"} tone={low ? "amber" : "teal"} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </AdminPanel>
        </div>

        <div className="grid gap-6 xl:grid-cols-4">
          <OrderStatusList
            description="Everything currently in the fulfillment queue."
            orders={pendingOrders}
            title="Pending"
            tone="teal"
          />
          <OrderStatusList
            description="Waiting on customer approval before the next move."
            orders={approvalOrders}
            title="Awaiting approval"
            tone="rose"
          />
          <OrderStatusList
            description="Packed and ready for the next shipment step."
            orders={scoopedOrders}
            title="Scooped"
            tone="slate"
          />
          <OrderStatusList
            description="Orders already handed off for delivery."
            orders={shippedOrders}
            title="Shipped"
            tone="amber"
          />
        </div>
      </div>
    </PageChrome>
  );
}

function OrderStatusList({
  description,
  orders,
  title,
  tone,
}: {
  description: string;
  orders: CustomerOrder[];
  title: string;
  tone: "amber" | "rose" | "slate" | "teal";
}): React.ReactElement {
  return (
    <AdminPanel
      action={<AdminStatusBadge label={String(orders.length)} tone={tone} />}
      description={description}
      title={title}
    >
      <div className="grid gap-3">
        {orders.length > 0 ? (
          orders.map((order) => (
            <Link
              className="rounded-[24px] border border-[#ebe2d8] bg-[#fffdfa] p-4 transition hover:border-[#bde5df] hover:bg-[#f9fffe]"
              href={`/admin/orders/${order.id}`}
              key={order.id}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-black text-[#35534d]">Order #{order.id}</span>
                <AdminStatusBadge label={order.status} tone={tone} />
              </div>
              <p className="mt-2 text-sm leading-6 text-[#6a8079]">
                {order.createdAt} · {order.tierName} · {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
              </p>
            </Link>
          ))
        ) : (
          <div className="rounded-[24px] border border-dashed border-[#d7e6e1] bg-[#f8fcfb] p-4 text-sm leading-6 text-[#6a8079]">
            Nothing is sitting in this lane right now.
          </div>
        )}
      </div>
    </AdminPanel>
  );
}
