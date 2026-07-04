import Link from "next/link";
import { PageChrome } from "@/components/page-chrome";
import { AdminMetricCard, AdminPanel, AdminStatusBadge } from "@/components/storefront-admin";
import { listInventory } from "@/lib/production-store";

export const dynamic = "force-dynamic";

export default async function InventoryPage(): Promise<React.ReactElement> {
  const inventoryItems = await listInventory();
  const lowStockItems = inventoryItems.filter((item) => item.availableGrams <= item.lowStockThreshold);
  const totalAvailable = inventoryItems.reduce((sum, item) => sum + item.availableGrams, 0);
  const trackedCategories = new Set(inventoryItems.map((item) => item.category)).size;

  return (
    <PageChrome
      title="Bulk inventory"
      subtitle="The MVP tracks bulk stock by grams, reserved grams, available grams, and low-stock thresholds."
    >
      <div className="grid gap-6">
        <section className="grid gap-4 md:grid-cols-3">
          <AdminMetricCard detail="Total grams currently available across every tracked supply." label="Available grams" value={String(totalAvailable)} />
          <AdminMetricCard detail="Supplies at or under their low-stock threshold." label="Low stock lines" tone="amber" value={String(lowStockItems.length)} />
          <AdminMetricCard detail="How many inventory categories are represented in the tracker." label="Categories" tone="slate" value={String(trackedCategories)} />
        </section>

        <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
          <AdminPanel
            action={
              <Link className="button-secondary" href="/admin/fulfillment">
                Open fulfillment
              </Link>
            }
            description="This view keeps the full bulk list easy to scan while still surfacing reserved stock and warning thresholds."
            title="Inventory ledger"
          >
            <div className="overflow-x-auto">
              <table className="storefront-data-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>On hand</th>
                    <th>Reserved</th>
                    <th>Available</th>
                    <th>Threshold</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryItems.map((item) => {
                    const low = item.availableGrams <= item.lowStockThreshold;
                    return (
                      <tr key={item.id}>
                        <td>
                          <span className="block font-black">{item.itemName}</span>
                          <span className="mt-1 block text-sm text-[#6a8079]">Tracked in grams for packing safety.</span>
                        </td>
                        <td className="text-[#6a8079]">{item.category}</td>
                        <td>{item.onHandGrams}g</td>
                        <td>{item.reservedGrams}g</td>
                        <td className="font-black text-[#35534d]">{item.availableGrams}g</td>
                        <td>{item.lowStockThreshold}g</td>
                        <td>
                          <AdminStatusBadge label={low ? "Low stock" : "In stock"} tone={low ? "amber" : "teal"} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </AdminPanel>

          <div className="grid gap-6">
            <section className="storefront-subtle-panel p-6 sm:p-8">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#6b817b]">Restock watch</p>
              <h2
                className="mt-3 text-4xl font-black tracking-[-0.05em] text-[#31514b]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Items closest to the line
              </h2>
              <div className="mt-6 space-y-3">
                {lowStockItems.length > 0 ? (
                  lowStockItems.map((item) => (
                    <div className="rounded-[22px] bg-white/84 p-4 shadow-[0_14px_34px_rgba(118,140,134,0.10)]" key={item.id}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-black text-[#35534d]">{item.itemName}</p>
                          <p className="mt-1 text-sm text-[#6a8079]">{item.category}</p>
                        </div>
                        <AdminStatusBadge label="Low stock" tone="amber" />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[#627872]">
                        {item.availableGrams}g available with a {item.lowStockThreshold}g threshold.
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[22px] bg-white/84 p-4 shadow-[0_14px_34px_rgba(118,140,134,0.10)]">
                    <p className="font-black text-[#35534d]">No items are currently flagged as low stock.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </PageChrome>
  );
}
