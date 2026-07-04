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
  const stages = ["Pending", "Awaiting Approval", "Scooped", "Shipped", "Delivered"];

  return (
    <PageChrome
      heroAside={
        <div className="grid w-full max-w-[360px] gap-3">
          {stages.slice(0, 3).map((stage, index) => (
            <div className="rounded-[26px] border border-white/75 bg-white/84 p-4 shadow-[0_20px_44px_rgba(124,146,140,0.14)] backdrop-blur" key={stage}>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f2fbfa] text-sm font-black text-[#18a59e]">
                {index + 1}
              </span>
              <p className="mt-3 text-sm font-black uppercase tracking-[0.14em] text-[#5f756f]">{stage}</p>
            </div>
          ))}
        </div>
      }
      title="Track an order"
      subtitle="Use your order number to open the current packing, approval, and shipping status page."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <form className="rounded-[32px] border border-[#ece3d9] bg-white p-6 shadow-[0_24px_58px_rgba(118,140,134,0.12)] sm:p-8" action="/tracking">
          <label className="text-sm font-black uppercase tracking-[0.12em] text-[#667c76]">
            Order number
            <input
              className="storefront-input mt-2"
              defaultValue={order ?? ""}
              name="order"
              placeholder="MS-12487"
            />
          </label>
          <div className="mt-4 flex flex-wrap gap-3">
            <button className="button-primary w-fit" type="submit">Find order</button>
            {order ? (
              <Link className="button-secondary w-fit" href={`/orders/${order.replace(/^#/, "")}`}>
                Open #{order.replace(/^#/, "")}
              </Link>
            ) : null}
          </div>
        </form>
        <aside className="rounded-[32px] border border-[#ece3d9] bg-[linear-gradient(135deg,#fff9ef_0%,#f1fbfb_100%)] p-6 shadow-[0_24px_58px_rgba(118,140,134,0.12)] sm:p-8">
          <PackageSearch className="text-[var(--teal)]" size={34} />
          <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#35534d]">Tracking stages</h2>
          <div className="mt-5 grid gap-3 text-sm font-bold">
            {stages.map((stage, index) => (
              <span className="rounded-[22px] bg-white/84 p-4 shadow-[0_14px_34px_rgba(118,140,134,0.10)]" key={stage}>
                <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f2fbfa] text-[#18a59e]">
                  {index + 1}
                </span>
                {stage}
              </span>
            ))}
          </div>
        </aside>
      </div>
    </PageChrome>
  );
}
