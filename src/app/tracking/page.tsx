import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { PageChrome } from "@/components/page-chrome";

type TrackingPageProps = {
  searchParams: Promise<{
    order?: string;
  }>;
};

export default async function TrackingPage({ searchParams }: TrackingPageProps): Promise<React.ReactElement> {
  const { order } = await searchParams;

  return (
    <PageChrome
      title="Track an order"
      subtitle="Use your order number to open the current packing, approval, and shipping status page."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <form className="app-card grid gap-4 p-6" action="/tracking">
          <label className="text-sm font-bold">
            Order number
            <input
              className="mt-2 h-11 w-full rounded-[7px] border border-[#d9cfd5] px-3"
              defaultValue={order ?? ""}
              name="order"
              placeholder="MS-12487"
            />
          </label>
          <button className="button-primary w-fit" type="submit">Find order</button>
          {order ? (
            <Link className="button-secondary w-fit" href={`/orders/${order.replace(/^#/, "")}`}>
              Open #{order.replace(/^#/, "")}
            </Link>
          ) : null}
        </form>
        <aside className="app-card p-6">
          <PackageSearch className="text-[var(--teal)]" size={34} />
          <h2 className="mt-4 text-2xl font-black">Tracking stages</h2>
          <div className="mt-5 grid gap-3 text-sm font-bold">
            {["Pending", "Awaiting Approval", "Scooped", "Shipped", "Delivered"].map((stage) => (
              <span className="rounded-[7px] bg-[#fff8fb] p-3" key={stage}>{stage}</span>
            ))}
          </div>
        </aside>
      </div>
    </PageChrome>
  );
}
