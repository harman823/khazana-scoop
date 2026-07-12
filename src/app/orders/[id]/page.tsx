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
  const stages = ["Pending", "Awaiting Approval", "Scooped", "Shipped", "Delivered"] as const;
  const currentStageIndex = stages.indexOf(order.status as (typeof stages)[number]);

  return (
    <PageChrome
      heroAside={
        <div className="grid w-full max-w-[360px] gap-4">
          <div className="rounded-[28px] border border-white/75 bg-white/84 p-5 shadow-[0_20px_44px_rgba(124,146,140,0.14)] backdrop-blur">
            <p className="text-sm font-black uppercase tracking-[0.14em] text-[#6d807a]">Quick view</p>
            <p className="mt-3 text-3xl font-black tracking-[-0.05em] text-[#35534d]" style={{ fontFamily: "var(--font-display)" }}>
              {order.status}
            </p>
            <p className="mt-3 text-sm leading-6 text-[#5d746d]">
              {order.tierName} · {formatMoney(order.totalCents)} · {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[26px] border border-white/75 bg-white/84 p-5 shadow-[0_20px_44px_rgba(124,146,140,0.14)] backdrop-blur">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[#6d807a]">Re-scoops</p>
              <p className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#35534d]">
                {order.reScoopCount}/{order.reScoopLimit}
              </p>
            </div>
            <div className="rounded-[26px] border border-white/75 bg-white/84 p-5 shadow-[0_20px_44px_rgba(124,146,140,0.14)] backdrop-blur">
              <p className="text-sm font-black uppercase tracking-[0.14em] text-[#6d807a]">Approval time</p>
              <p className="mt-3 text-2xl font-black tracking-[-0.04em] text-[#35534d]">
                {order.status === "Awaiting Approval" ? `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}` : "Closed"}
              </p>
            </div>
          </div>
        </div>
      }
      title={`Order #${order.id}`}
      subtitle="Watch the pack, approve your scoop, or use your re-scoop window before it expires."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-[32px] border border-[#ece3d9] bg-white shadow-[0_24px_58px_rgba(118,140,134,0.12)]">
          <div className="relative h-[360px] bg-[#fff1f6]">
            <Image
              alt="Mystery Scoop packing preview"
              className="object-cover"
              fill
              loading="eager"
              priority
              src={order.scoopPhotoUrl ?? "/mystery-scoop-hero.png"}
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-black/62 text-white">▶</span>
            </span>
          </div>
          <div className="p-6">
            <h2 className="text-3xl font-black tracking-[-0.04em] text-[#35534d]">Packing video</h2>
            <p className="mt-2 text-[#667b75]">
              {order.packingVideoUrl ? order.packingVideoUrl : "The fulfillment team has not attached a video yet."}
            </p>
          </div>
        </div>
        <aside className="h-fit rounded-[32px] border border-[#ece3d9] bg-[linear-gradient(135deg,#fff9ef_0%,#f1fbfb_100%)] p-6 shadow-[0_24px_58px_rgba(118,140,134,0.12)]">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#708680]">Status</p>
          <p className="mt-2 text-4xl font-black tracking-[-0.05em] text-[#32524b]" style={{ fontFamily: "var(--font-display)" }}>{order.status}</p>
          <div className="mt-6 space-y-4">
            {stages.map((status, index) => (
              <div className="flex items-center gap-3" key={status}>
                <span className={`h-4 w-4 rounded-full ${index <= currentStageIndex ? "bg-[#f72c7b]" : "bg-[#eadfe4]"}`} />
                <span className="text-sm font-bold text-[#35534d]">{status}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[24px] bg-white/84 p-4 text-sm text-[#5f756f] shadow-[0_14px_34px_rgba(118,140,134,0.10)]">
            <div className="flex justify-between"><span>{order.tierName} Scoop</span><strong>{formatMoney(order.totalCents)}</strong></div>
            <div className="mt-2 flex justify-between"><span>Items</span><strong>{order.itemCount}</strong></div>
          </div>
          {order.status === "Awaiting Approval" ? (
            <div className="mt-5 rounded-[24px] bg-[#fff8df] p-4">
              <p className="font-black text-[#35534d]">{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")} left to decide</p>
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
