import Link from "next/link";
import { PageChrome } from "@/components/page-chrome";
import { listInventory, listOrders } from "@/lib/production-store";

export const dynamic = "force-dynamic";

export default async function AdminPage(): Promise<React.ReactElement> {
  const [orders, inventoryItems] = await Promise.all([listOrders(), listInventory()]);
  const lowStockCount = inventoryItems.filter((item) => item.availableGrams <= item.lowStockThreshold).length;
  const scoopedCount = orders.filter((order) => order.status === "Scooped").length;
  return (
    <PageChrome
      title="Fulfillment dashboard"
      subtitle="Pack orders, attach short-form video links, and keep bulk inventory from overselling during live drops."
    >
      <div className="grid gap-6 md:grid-cols-3">
        <Metric label="Orders" value={String(orders.length)} />
        <Metric label="Scooped" value={String(scoopedCount)} />
        <Metric label="Low stock" value={String(lowStockCount)} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="app-card p-6">
          <h2 className="text-2xl font-black">Packing queue</h2>
          <div className="mt-5 space-y-3">
            {orders.map((order) => (
              <Link className="grid gap-3 rounded-[7px] border border-[#efe4e8] p-4 md:grid-cols-[1fr_auto]" href={`/admin/orders/${order.id}`} key={order.id}>
                <span>
                  <span className="block font-black">Order #{order.id}</span>
                  <span className="block text-sm text-muted">{order.tierName} · {order.status}</span>
                </span>
                <span className="button-secondary min-h-9 px-3">Open</span>
              </Link>
            ))}
          </div>
        </div>
        <aside className="app-card p-6">
          <h2 className="text-2xl font-black">Admin links</h2>
          <div className="mt-5 grid gap-3">
            <Link className="button-primary w-full" href="/admin/fulfillment">Orders, packed & shipped</Link>
            <Link className="button-primary w-full" href="/admin/inventory">Manage inventory</Link>
            <Link className="button-secondary w-full" href="/admin/database">View database tables</Link>
            <Link className="button-secondary w-full" href="/orders/MS-12487">Preview customer order</Link>
          </div>
        </aside>
      </div>
    </PageChrome>
  );
}

function Metric({ label, value }: { label: string; value: string }): React.ReactElement {
  return (
    <div className="app-card p-6">
      <p className="text-sm font-black text-muted">{label}</p>
      <p className="mt-2 text-4xl font-black">{value}</p>
    </div>
  );
}
