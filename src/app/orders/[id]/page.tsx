import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageChrome } from "@/components/page-chrome";
import { approvalSecondsRemaining, canReScoop } from "@/lib/order-state";
import { formatMoney } from "@/lib/pricing";
import { getOrder } from "@/lib/production-store";

type OrderPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderPage({ params }: OrderPageProps): Promise<React.ReactElement> {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) {
    notFound();
  }
  const seconds = approvalSecondsRemaining(order);

  return (
    <PageChrome
      title={`Order #${order.id}`}
      subtitle="Watch the pack, approve your scoop, or use your re-scoop window before it expires."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="app-card overflow-hidden">
          <div className="relative h-[360px] bg-[#fff1f6]">
            <Image
              alt="Mystery Scoop packing preview"
              className="object-cover"
              fill
              priority
              src={order.scoopPhotoUrl ?? "/mystery-scoop-hero.png"}
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-black/62 text-white">▶</span>
            </span>
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-black">Packing video</h2>
            <p className="mt-2 text-muted">
              {order.packingVideoUrl ? order.packingVideoUrl : "The fulfillment team has not attached a video yet."}
            </p>
          </div>
        </div>
        <aside className="app-card h-fit p-6">
          <p className="text-sm font-black text-muted">Status</p>
          <p className="mt-1 text-3xl font-black">{order.status}</p>
          <div className="mt-6 space-y-4">
            {["Pending", "Scooped", "Shipped"].map((status) => (
              <div className="flex items-center gap-3" key={status}>
                <span className={`h-4 w-4 rounded-full ${status === order.status || status === "Pending" ? "bg-[#f72c7b]" : "bg-[#eadfe4]"}`} />
                <span className="text-sm font-bold">{status}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[7px] bg-[#fff8fb] p-4 text-sm">
            <div className="flex justify-between"><span>{order.tierName} Scoop</span><strong>{formatMoney(order.totalCents)}</strong></div>
            <div className="mt-2 flex justify-between"><span>Items</span><strong>{order.itemCount}</strong></div>
          </div>
          {order.status === "Awaiting Approval" ? (
            <div className="mt-5 rounded-[7px] bg-[#fff8df] p-4">
              <p className="font-black">{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")} left to decide</p>
              <div className="mt-4 grid gap-3">
                <Link className="button-primary w-full" href="/account">Accept scoop</Link>
                <Link className={`button-secondary w-full ${canReScoop(order) ? "" : "pointer-events-none opacity-50"}`} href="/checkout">
                  Re-scoop
                </Link>
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </PageChrome>
  );
}
