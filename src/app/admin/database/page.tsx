import Link from "next/link";
import { Database, ExternalLink, TableProperties } from "lucide-react";
import { PageChrome } from "@/components/page-chrome";
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
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="app-card p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-[7px] bg-[rgba(0,184,173,0.1)] text-[var(--teal)]">
              <Database size={20} />
            </span>
            <div>
              <h2 className="font-black">Tables</h2>
              <p className="text-xs text-muted">{adminTableConfigs.length} managed areas</p>
            </div>
          </div>
          <div className="mt-5 grid gap-2">
            {adminTableConfigs.map((config) => (
              <Link
                className={`rounded-[7px] border px-3 py-3 text-sm font-black transition ${
                  config.key === snapshot.key
                    ? "border-[#f72c7b] bg-[#fff3f7] text-[#c9155c]"
                    : "border-[#efe4e8] bg-white hover:border-[var(--teal)]"
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
          <div className="grid gap-4 md:grid-cols-3">
            <Metric label="Selected table" value={snapshot.label} />
            <Metric label="Rows" value={String(snapshot.count)} />
            <Metric label="Source" value="Supabase" />
          </div>

          <div className="app-card overflow-hidden">
            <div className="flex flex-col gap-4 border-b border-[#efe4e8] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[7px] bg-[#fff3f7] text-[#f72c7b]">
                  <TableProperties size={20} />
                </span>
                <span>
                  <h2 className="text-xl font-black">{snapshot.label}</h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">{snapshot.description}</p>
                </span>
              </div>
              {snapshot.primaryAction ? (
                <Link className="button-secondary shrink-0" href={snapshot.primaryAction.href}>
                  {snapshot.primaryAction.label} <ExternalLink size={16} />
                </Link>
              ) : null}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-[#fff8fb] text-xs text-muted">
                  <tr>
                    {snapshot.columns.map((column) => (
                      <th className="p-4" key={column.key}>
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {snapshot.rows.length > 0 ? (
                    snapshot.rows.map((row, index) => (
                      <tr className="border-t border-[#f4edf0]" key={`${snapshot.key}-${index}`}>
                        {snapshot.columns.map((column) => (
                          <td className="max-w-[280px] truncate p-4" key={column.key}>
                            {formatCellValue(row[column.key], column.key)}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr className="border-t border-[#f4edf0]">
                      <td className="p-6 text-muted" colSpan={snapshot.columns.length}>
                        No rows yet. Once Supabase has records for this table, they will appear here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="app-card grid gap-4 p-5 md:grid-cols-3">
            <AdminHint
              title="Safe for nontechnical admins"
              body="This view reads from approved tables and links editing to dedicated admin screens."
            />
            <AdminHint
              title="Supabase-backed"
              body="When DATABASE_URL is connected, this streams live rows from Supabase Postgres."
            />
            <AdminHint
              title="Media-aware"
              body="StorageAsset tracks bucket, path, and use case for every uploaded image or video."
            />
          </div>
        </section>
      </div>
    </PageChrome>
  );
}

function Metric({ label, value }: { label: string; value: string }): React.ReactElement {
  return (
    <div className="app-card p-5">
      <p className="text-xs font-black text-muted">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

function AdminHint({ title, body }: { title: string; body: string }): React.ReactElement {
  return (
    <div>
      <h3 className="text-sm font-black">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-muted">{body}</p>
    </div>
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
