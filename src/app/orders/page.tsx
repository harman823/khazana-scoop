import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PageChrome } from "@/components/page-chrome";
import { formatMoney } from "@/lib/pricing";
import { SESSION_COOKIE_NAME, getUserFromSession, listOrders } from "@/lib/production-store";

export const dynamic = "force-dynamic";

export default async function OrdersPage(): Promise<React.ReactElement> {
  const cookieStore = await cookies();
  const user = await getUserFromSession(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!user) {
    redirect("/login");
  }
  const orders = await listOrders(user.id);

  return (
    <PageChrome
      title="Your orders"
      subtitle="Track scoop status, packing videos, re-scoop windows, and shipment progress."
    >
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-[32px] border border-[#ece3d9] bg-[linear-gradient(135deg,#fff9ef_0%,#f1fbfb_100%)] p-6 shadow-[0_24px_58px_rgba(118,140,134,0.12)] sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#708680]">Account snapshot</p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-[#32524b]" style={{ fontFamily: "var(--font-display)" }}>
            {user.name}
          </h2>
          <p className="mt-2 text-sm leading-7 text-[#627771]">{user.email}</p>
          <div className="mt-6 grid gap-3">
            {["Awaiting approval", "Scooped", "Shipped", "Delivered"].map((stage) => (
              <div className="rounded-[22px] bg-white/84 p-4 text-sm font-bold text-[#35534d] shadow-[0_14px_34px_rgba(118,140,134,0.10)]" key={stage}>
                {stage}
              </div>
            ))}
          </div>
        </aside>

        <section className="rounded-[32px] border border-[#ece3d9] bg-white p-6 shadow-[0_24px_58px_rgba(118,140,134,0.12)] sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#708680]">Order history</p>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-[#32524b]" style={{ fontFamily: "var(--font-display)" }}>
                Scoop timeline
              </h2>
            </div>
            <Link className="button-secondary" href="/tracking">
              Track by order number
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {orders.length > 0 ? (
              orders.map((order) => (
                <Link
                  className="grid gap-4 rounded-[28px] border border-[#ece3d9] p-5 transition hover:border-[#bde5df] hover:bg-[#f9fffe] md:grid-cols-[1fr_auto]"
                  href={`/orders/${order.id}`}
                  key={order.id}
                >
                  <div>
                    <p className="text-xl font-black tracking-[-0.03em] text-[#35534d]">Order #{order.id}</p>
                    <p className="mt-2 text-sm leading-7 text-[#667b75]">
                      {order.createdAt} · {order.tierName} Scoop · {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-3 md:items-end">
                    <span className="rounded-full bg-[#f2fbfa] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#18a59e]">
                      {order.status}
                    </span>
                    <strong className="text-sm uppercase tracking-[0.08em] text-[#35534d]">{formatMoney(order.totalCents)}</strong>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-[28px] border border-[#ece3d9] bg-[#fffdfa] p-6 text-center">
                <p className="text-xl font-black tracking-[-0.03em] text-[#35534d]">No orders yet</p>
                <p className="mt-3 text-sm leading-7 text-[#667b75]">Build your first mystery scoop and every status update will appear here.</p>
                <Link className="button-primary mt-5" href="/mystery-scoops">
                  Build my scoop
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </PageChrome>
  );
}
