import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PageChrome } from "@/components/page-chrome";
import { OrdersOverview } from "@/components/orders-overview";
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
      <OrdersOverview orders={orders} user={user} />
    </PageChrome>
  );
}
