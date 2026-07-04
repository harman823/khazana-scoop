import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Tone = "teal" | "amber" | "rose" | "slate";

const toneClasses: Record<Tone, string> = {
  teal: "bg-[#f1fbfa] text-[#178d86] border-[#cfeae5]",
  amber: "bg-[#fff8e8] text-[#c98a1e] border-[#f1dfb0]",
  rose: "bg-[#fff2f6] text-[#d85d8d] border-[#f0c9d8]",
  slate: "bg-[#f5f7f6] text-[#5f746e] border-[#dbe5e1]",
};

export function AdminMetricCard({
  detail,
  label,
  tone = "teal",
  value,
}: {
  detail?: string;
  label: string;
  tone?: Tone;
  value: string;
}): React.ReactElement {
  return (
    <div className="storefront-stat-card">
      <span className={`storefront-status-badge ${toneClasses[tone]}`}>{label}</span>
      <p
        className="mt-4 text-4xl font-black tracking-[-0.05em] text-[#31524c] sm:text-[2.8rem]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {value}
      </p>
      {detail ? <p className="mt-3 text-sm leading-6 text-[#67807a]">{detail}</p> : null}
    </div>
  );
}

export function AdminPanel({
  action,
  children,
  className = "",
  description,
  title,
}: {
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  description?: string;
  title: string;
}): React.ReactElement {
  return (
    <section className={`storefront-panel ${className}`.trim()}>
      <div className="flex flex-col gap-3 border-b border-[#efe7de] px-6 py-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-[1.75rem] font-black tracking-[-0.04em] text-[#33534d]">{title}</h2>
          {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6a7f79]">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="px-6 py-6">{children}</div>
    </section>
  );
}

export function AdminActionTile({
  body,
  href,
  label,
}: {
  body: string;
  href: string;
  label: string;
}): React.ReactElement {
  return (
    <Link
      className="rounded-[24px] border border-[#e9e1d7] bg-[#fffdf9] p-5 transition hover:-translate-y-0.5 hover:border-[#bee4dd] hover:bg-[#f7fffd]"
      href={href}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-black tracking-[-0.03em] text-[#35534d]">{label}</h3>
        <ArrowUpRight className="text-[#18a59e]" size={18} />
      </div>
      <p className="mt-3 text-sm leading-6 text-[#6a8079]">{body}</p>
    </Link>
  );
}

export function AdminStatusBadge({
  label,
  tone = "slate",
}: {
  label: string;
  tone?: Tone;
}): React.ReactElement {
  return <span className={`storefront-status-badge ${toneClasses[tone]}`}>{label}</span>;
}
