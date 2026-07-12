import Link from "next/link";
import { notFound } from "next/navigation";
import { PageChrome } from "@/components/page-chrome";
import { AdminMetricCard, AdminPanel, AdminStatusBadge } from "@/components/storefront-admin";
import { formatMoney } from "@/lib/pricing";
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
      <div className="grid gap-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AdminMetricCard detail="Current state shown to the customer in their order timeline." label="Status" value={order.status} />
          <AdminMetricCard detail="How many items are included in this mystery scoop order." label="Items" tone="rose" value={String(order.itemCount)} />
          <AdminMetricCard detail="Total currently charged for the order." label="Order total" tone="amber" value={formatMoney(order.totalCents)} />
          <AdminMetricCard detail="Used vs allowed re-scoops on this order." label="Re-scoops" tone="slate" value={`${order.reScoopCount}/${order.reScoopLimit}`} />
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <AdminPanel
            action={
              <Link className="button-secondary" href="/admin/fulfillment">
                Back to fulfillment
              </Link>
            }
            description="Keep the media links and status fields in one tidy surface before saving the update."
            title="Fulfillment update"
          >
            <form className="grid gap-5">
              <label className="text-sm font-bold text-[#35534d]">
                Packing video URL
                <input
                  className="storefront-input mt-2"
                  defaultValue={order.packingVideoUrl ?? ""}
                  placeholder="https://..."
                />
              </label>
              <label className="text-sm font-bold text-[#35534d]">
                Scoop photo URL
                <input
                  className="storefront-input mt-2"
                  defaultValue={order.scoopPhotoUrl ?? "/mystery-scoop-hero.png"}
                  placeholder="https://..."
                />
              </label>
              <label className="text-sm font-bold text-[#35534d]">
                Status
                <select className="storefront-input mt-2" defaultValue={order.status}>
                  {["Pending", "Awaiting Approval", "Scooped", "Shipped", "Delivered", "Cancelled"].map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button className="button-primary w-fit" type="button">
                  Save fulfillment update
                </button>
                <Link className="button-secondary" href={`/orders/${order.id}`}>
                  Preview customer view
                </Link>
              </div>
            </form>
          </AdminPanel>

          <div className="grid gap-6">
            <section className="storefront-subtle-panel p-6 sm:p-8">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#6b817b]">Order snapshot</p>
              <h2
                className="mt-3 text-4xl font-black tracking-[-0.05em] text-[#31514b]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {order.tierName}
              </h2>
              <div className="mt-5 flex flex-wrap gap-3">
                <AdminStatusBadge label={order.status} tone={order.status === "Shipped" ? "amber" : order.status === "Scooped" ? "rose" : "teal"} />
                <AdminStatusBadge label={order.createdAt} tone="slate" />
              </div>
              <div className="mt-6 rounded-[24px] bg-white/84 p-5 shadow-[0_14px_34px_rgba(118,140,134,0.10)]">
                <p className="text-sm leading-7 text-[#627872]">
                  Approval window: {order.approvalExpiresAt ?? "No active approval timer on this order."}
                </p>
              </div>
            </section>

            <AdminPanel title="Media checklist">
              <div className="grid gap-3">
                <div className="rounded-[22px] border border-[#ebe2d8] bg-[#fffdfa] p-4">
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-[#6b817b]">Packing video</p>
                  <p className="mt-2 text-sm leading-6 text-[#627872]">
                    {order.packingVideoUrl ? order.packingVideoUrl : "Not attached yet."}
                  </p>
                </div>
                <div className="rounded-[22px] border border-[#ebe2d8] bg-[#fffdfa] p-4">
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-[#6b817b]">Scoop photo</p>
                  <p className="mt-2 text-sm leading-6 text-[#627872]">
                    {order.scoopPhotoUrl ? order.scoopPhotoUrl : "No scoop photo attached yet."}
                  </p>
                </div>
              </div>
            </AdminPanel>
          </div>
        </div>
      </div>
    </PageChrome>
  );
}
