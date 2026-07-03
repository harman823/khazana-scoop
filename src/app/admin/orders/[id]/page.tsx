import { notFound } from "next/navigation";
import { PageChrome } from "@/components/page-chrome";
import { getOrder } from "@/lib/production-store";

type AdminOrderPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrderPage({ params }: AdminOrderPageProps): Promise<React.ReactElement> {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) {
    notFound();
  }

  return (
    <PageChrome
      title={`Pack order #${order.id}`}
      subtitle="Attach the packing video URL, update the scoop status, and keep the customer approval flow moving."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <form className="app-card grid gap-4 p-6">
          <label className="text-sm font-bold">
            Packing video URL
            <input className="mt-2 h-11 w-full rounded-[7px] border border-[#d9cfd5] px-3" defaultValue={order.packingVideoUrl ?? ""} />
          </label>
          <label className="text-sm font-bold">
            Scoop photo URL
            <input className="mt-2 h-11 w-full rounded-[7px] border border-[#d9cfd5] px-3" defaultValue={order.scoopPhotoUrl ?? "/mystery-scoop-hero.png"} />
          </label>
          <label className="text-sm font-bold">
            Status
            <select className="mt-2 h-11 w-full rounded-[7px] border border-[#d9cfd5] px-3" defaultValue={order.status}>
              {["Pending", "Awaiting Approval", "Scooped", "Shipped", "Delivered", "Cancelled"].map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>
          <button className="button-primary w-fit" type="button">Save fulfillment update</button>
        </form>
        <aside className="app-card p-6">
          <p className="text-sm font-black text-muted">Current status</p>
          <p className="mt-2 text-3xl font-black">{order.status}</p>
          <p className="mt-5 text-sm text-muted">Re-scoop count: {order.reScoopCount} / {order.reScoopLimit}</p>
        </aside>
      </div>
    </PageChrome>
  );
}
