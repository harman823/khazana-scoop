import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PageChrome } from "@/components/page-chrome";
import { formatMoney } from "@/lib/pricing";
import { SESSION_COOKIE_NAME, getUserFromSession, listOrders } from "@/lib/production-store";

export const dynamic = "force-dynamic";

export default async function AccountPage(): Promise<React.ReactElement> {
  const cookieStore = await cookies();
  const currentUser = await getUserFromSession(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!currentUser) {
    redirect("/login");
  }
  const orders = await listOrders(currentUser.id);

  return (
    <PageChrome
      title={`Hey, ${currentUser.name}`}
      subtitle="Track your past scoops, Scoop Points, re-scoop windows, and packing videos in one place."
    >
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="rounded-[32px] border border-[#ece3d9] bg-[linear-gradient(135deg,#fff9ef_0%,#f1fbfb_100%)] p-6 shadow-[0_24px_58px_rgba(118,140,134,0.12)] sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#708680]">Scoop Points</p>
          <p className="mt-2 text-6xl font-black tracking-[-0.05em] text-[#ef8fb3]" style={{ fontFamily: "var(--font-display)" }}>
            {currentUser.scoopPoints.toLocaleString()}
          </p>
          <div className="mt-5 h-3 rounded-full bg-[#f2e8ed]">
            <div className="h-3 w-2/3 rounded-full bg-[#ef8fb3]" />
          </div>
          <p className="mt-3 text-sm text-[#657a74]">720 points to your next reward.</p>
          <div className="mt-6 grid gap-3">
            {["Birthday bonus", "Theme drop early access", "Exclusive member perks"].map((item) => (
              <div className="rounded-[22px] bg-white/84 p-4 text-sm font-bold text-[#35534d] shadow-[0_14px_34px_rgba(118,140,134,0.10)]" key={item}>{item}</div>
            ))}
          </div>
        </aside>
        <div className="rounded-[32px] border border-[#ece3d9] bg-white p-6 shadow-[0_24px_58px_rgba(118,140,134,0.12)] sm:p-8">
          <h2 className="text-3xl font-black tracking-[-0.04em] text-[#35534d]">Past orders</h2>
          <div className="mt-5 space-y-3">
            {orders.map((order) => (
              <Link className="grid gap-3 rounded-[24px] border border-[#ece3d9] p-5 transition hover:border-[#bde5df] hover:bg-[#f9fffe] md:grid-cols-[1fr_auto]" href={`/orders/${order.id}`} key={order.id}>
                <span>
                  <span className="block text-lg font-black tracking-[-0.03em] text-[#35534d]">Order #{order.id}</span>
                  <span className="block text-sm text-[#667b75]">{order.createdAt} · {order.tierName} Scoop · {order.status}</span>
                </span>
                <strong className="text-sm uppercase tracking-[0.08em] text-[#18a59e]">{formatMoney(order.totalCents)}</strong>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageChrome>
  );
}
