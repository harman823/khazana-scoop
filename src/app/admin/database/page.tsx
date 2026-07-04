import Link from "next/link";
import { Database, ExternalLink, TableProperties } from "lucide-react";
import { PageChrome } from "@/components/page-chrome";
import { AdminMetricCard, AdminPanel, AdminStatusBadge } from "@/components/storefront-admin";
import {
  adminTableConfigs,
  getAdminTableConfig,
  getAdminTableSnapshot,
} from "@/lib/admin-database";

export const dynamic = "force-dynamic";

type AdminDatabasePageProps = {
  searchParams: Promise<{
    table?: string;
  }>;
};

export default async function AdminDatabasePage({
  searchParams,
}: AdminDatabasePageProps): Promise<React.ReactElement> {
  const { table } = await searchParams;
  const selectedTable = getAdminTableConfig(table);
  const snapshot = await getAdminTableSnapshot(selectedTable.key);

  return (
    <PageChrome
      title="Admin database"
      subtitle="A friendly view of the Supabase tables behind Mystery Scoop, built for admins who should not need SQL."
    >
      <div className="grid gap-6 xl:grid-cols-[290px_1fr]">
        <aside className="storefront-panel p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-[18px] bg-[rgba(24,165,158,0.12)] text-[var(--teal)]">
              <Database size={22} />
            </span>
            <div>
              <h2 className="text-xl font-black tracking-[-0.03em] text-[#35534d]">Tables</h2>
              <p className="text-sm text-[#6a8079]">{adminTableConfigs.length} managed areas</p>
            </div>
          </div>
          <div className="mt-6 grid gap-2">
            {adminTableConfigs.map((config) => (
              <Link
                className={`rounded-[22px] border px-4 py-4 text-sm font-black transition ${
                  config.key === snapshot.key
                    ? "border-[#bfe6e0] bg-[#f5fffd] text-[#1b867f]"
                    : "border-[#ece3d9] bg-[#fffdfa] text-[#35534d] hover:border-[#bfe6e0] hover:bg-[#f7fffd]"
                }`}
                href={`/admin/database?table=${config.key}`}
                key={config.key}
              >
                {config.label}
              </Link>
            ))}
          </div>
        </aside>

        <section className="grid gap-6">
          <section className="grid gap-4 md:grid-cols-3">
            <AdminMetricCard detail="The table currently selected in this admin browser." label="Selected table" value={snapshot.label} />
            <AdminMetricCard detail="Rows fetched for the present snapshot." label="Rows" tone="rose" value={String(snapshot.count)} />
            <AdminMetricCard
              detail="Current source for the read-only admin surface."
              label="Source"
              tone="slate"
              value={snapshot.source === "demo" ? "Demo data" : "Supabase"}
            />
          </section>

          <AdminPanel
            action={
              snapshot.primaryAction ? (
                <Link className="button-secondary shrink-0" href={snapshot.primaryAction.href}>
                  {snapshot.primaryAction.label} <ExternalLink size={16} />
                </Link>
              ) : undefined
            }
            description={snapshot.description}
            title={snapshot.label}
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-[18px] bg-[#fff5f8] text-[#d85d8d]">
                <TableProperties size={22} />
              </span>
              <AdminStatusBadge label={`${snapshot.columns.length} columns`} tone="rose" />
            </div>

            <div className="overflow-x-auto">
              <table className="storefront-data-table">
                <thead>
                  <tr>
                    {snapshot.columns.map((column) => (
                      <th key={column.key}>{column.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {snapshot.rows.length > 0 ? (
                    snapshot.rows.map((row, index) => (
                      <tr key={`${snapshot.key}-${index}`}>
                        {snapshot.columns.map((column) => (
                          <td className="max-w-[280px] truncate" key={column.key}>
                            {formatCellValue(row[column.key], column.key)}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="text-[#6a8079]" colSpan={snapshot.columns.length}>
                        No rows yet. Once Supabase has records for this table, they will appear here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </AdminPanel>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[26px] border border-[#ece3d9] bg-white p-5 shadow-[0_20px_48px_rgba(118,140,134,0.10)]">
              <h3 className="text-lg font-black tracking-[-0.03em] text-[#35534d]">Safe for nontechnical admins</h3>
              <p className="mt-3 text-sm leading-6 text-[#6a8079]">
                This view reads from approved tables and links editing to dedicated admin screens.
              </p>
            </div>
            <div className="rounded-[26px] border border-[#ece3d9] bg-white p-5 shadow-[0_20px_48px_rgba(118,140,134,0.10)]">
              <h3 className="text-lg font-black tracking-[-0.03em] text-[#35534d]">Supabase-backed</h3>
              <p className="mt-3 text-sm leading-6 text-[#6a8079]">
                When DATABASE_URL is connected, this streams live rows from Supabase Postgres.
              </p>
            </div>
            <div className="rounded-[26px] border border-[#ece3d9] bg-white p-5 shadow-[0_20px_48px_rgba(118,140,134,0.10)]">
              <h3 className="text-lg font-black tracking-[-0.03em] text-[#35534d]">Media-aware</h3>
              <p className="mt-3 text-sm leading-6 text-[#6a8079]">
                StorageAsset tracks bucket, path, and use case for every uploaded image or video.
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageChrome>
  );
}

function formatCellValue(value: unknown, key: string): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "bigint") return value.toString();
  if (typeof value === "number" && key.toLowerCase().includes("cents")) {
    return `$${(value / 100).toFixed(2)}`;
  }
  if (value instanceof Date) return value.toLocaleDateString("en-US");
  if (typeof value === "string" && value.includes("T") && !Number.isNaN(Date.parse(value))) {
    return new Date(value).toLocaleDateString("en-US");
  }

  return String(value);
}
