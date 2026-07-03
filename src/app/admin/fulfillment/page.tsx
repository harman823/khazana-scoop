import Link from "next/link";
import { Upload } from "lucide-react";
import { PageChrome } from "@/components/page-chrome";
import { listInventory, listOrders } from "@/lib/production-store";
import type { CustomerOrder } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminFulfillmentPage(): Promise<React.ReactElement> {
  const [orders, inventoryItems] = await Promise.all([listOrders(), listInventory()]);
  const scoopedOrders = orders.filter((order) => order.status === "Scooped");
  const shippedOrders = orders.filter((order) => order.status === "Shipped");

  return (
    <PageChrome
      title="Packing operations"
      subtitle="Review inventory health and today’s order progress across ordered, packed, scooped, and shipped scoops."
    >
      <div className="grid gap-6">
        <div className="app-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#efe4e8] p-5">
            <h2 className="text-xl font-black">Inventory overview</h2>
            <Link className="text-sm font-black" href="/admin">Open admin</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-[#fff8fb] text-xs text-muted">
                <tr>
                  <th className="p-4">Item</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">On hand</th>
                  <th className="p-4">Reserved</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {inventoryItems.map((item) => {
                  const low = item.availableGrams <= item.lowStockThreshold;
                  return (
                    <tr className="border-t border-[#f4edf0]" key={item.id}>
                      <td className="p-4 font-black">{item.itemName}</td>
                      <td className="p-4 text-muted">{item.category}</td>
                      <td className="p-4">{item.onHandGrams}</td>
                      <td className="p-4">{item.reservedGrams}</td>
                      <td className="p-4">
                        <span className={`rounded-[5px] px-2 py-1 text-xs font-black ${low ? "bg-[#fff0ee] text-[#d63f3f]" : "bg-[#effbf5] text-[#247b55]"}`}>
                          {low ? "Low stock" : "In stock"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="app-card p-6">
          <h2 className="text-xl font-black">Today&apos;s packing</h2>
          <div className="mt-6 space-y-4 text-base">
            <div className="flex justify-between"><span>Orders</span><strong>{orders.length}</strong></div>
            <div className="flex justify-between"><span>Scooped</span><strong>{scoopedOrders.length}</strong></div>
            <div className="flex justify-between"><span>Shipped</span><strong>{shippedOrders.length}</strong></div>
          </div>
          <p className="mt-6 flex items-center gap-3 rounded-[7px] bg-[#effbf5] p-5 text-sm font-bold text-[#247b55]">
            <Upload size={18} /> Quality check: all good to go.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <OrderStatusList
            orders={orders}
            title="All orders"
            description="Everything currently in the fulfillment queue."
          />
          <OrderStatusList
            orders={scoopedOrders}
            title="Packed / scooped"
            description="Orders that have been packed and are ready for the next step."
          />
          <OrderStatusList
            orders={shippedOrders}
            title="Shipped"
            description="Orders already handed off for delivery."
          />
        </div>
      </div>
    </PageChrome>
  );
}

function OrderStatusList({
  title,
  description,
  orders,
}: {
  title: string;
  description: string;
  orders: CustomerOrder[];
}): React.ReactElement {
  return (
    <section className="app-card p-5">
      <div className="flex items-start justify-between gap-3">
        <span>
          <h2 className="text-xl font-black">{title}</h2>
          <p className="mt-1 text-xs leading-5 text-muted">{description}</p>
        </span>
        <span className="rounded-[5px] bg-[#fff3f7] px-2 py-1 text-xs font-black text-[#f72c7b]">
          {orders.length}
        </span>
      </div>
      <div className="mt-5 space-y-3">
        {orders.map((order) => (
          <Link
            className="block rounded-[7px] border border-[#efe4e8] p-4 transition hover:border-[#f72c7b]"
            href={`/admin/orders/${order.id}`}
            key={order.id}
          >
            <span className="flex items-center justify-between gap-3">
              <span className="font-black">Order #{order.id}</span>
              <span className="rounded-[5px] bg-[#f7f3f5] px-2 py-1 text-xs font-black">
                {order.status}
              </span>
            </span>
            <span className="mt-1 block text-xs text-muted">
              {order.createdAt} · {order.tierName} · {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
