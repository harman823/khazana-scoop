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
        <aside className="app-card p-6">
          <p className="text-sm font-black text-muted">Scoop Points</p>
          <p className="mt-2 text-6xl font-black text-[#f72c7b]">{currentUser.scoopPoints.toLocaleString()}</p>
          <div className="mt-5 h-3 rounded-full bg-[#f2e8ed]">
            <div className="h-3 w-2/3 rounded-full bg-[#f72c7b]" />
          </div>
          <p className="mt-3 text-sm text-muted">720 points to your next reward.</p>
          <div className="mt-6 grid gap-3">
            {["Birthday bonus", "Theme drop early access", "Exclusive member perks"].map((item) => (
              <div className="rounded-[7px] bg-[#fff3f7] p-4 text-sm font-bold" key={item}>{item}</div>
            ))}
          </div>
        </aside>
        <div className="app-card p-6">
          <h2 className="text-2xl font-black">Past orders</h2>
          <div className="mt-5 space-y-3">
            {orders.map((order) => (
              <Link className="grid gap-3 rounded-[7px] border border-[#efe4e8] p-4 md:grid-cols-[1fr_auto]" href={`/orders/${order.id}`} key={order.id}>
                <span>
                  <span className="block font-black">Order #{order.id}</span>
                  <span className="block text-sm text-muted">{order.createdAt} · {order.tierName} Scoop · {order.status}</span>
                </span>
                <strong>{formatMoney(order.totalCents)}</strong>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageChrome>
  );
}
