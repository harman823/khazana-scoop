import { PageChrome } from "@/components/page-chrome";
import { listInventory } from "@/lib/production-store";

export const dynamic = "force-dynamic";

export default async function InventoryPage(): Promise<React.ReactElement> {
  const inventoryItems = await listInventory();

  return (
    <PageChrome
      title="Bulk inventory"
      subtitle="The MVP tracks bulk stock by grams, reserved grams, available grams, and low-stock thresholds."
    >
      <div className="app-card overflow-hidden">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-[#fff8fb] text-xs text-muted">
            <tr>
              <th className="p-4">Item</th>
              <th className="p-4">Category</th>
              <th className="p-4">On hand</th>
              <th className="p-4">Reserved</th>
              <th className="p-4">Available</th>
              <th className="p-4">Threshold</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems.map((item) => {
              const low = item.availableGrams <= item.lowStockThreshold;
              return (
                <tr className="border-t border-[#f4edf0]" key={item.id}>
                  <td className="p-4 font-black">{item.itemName}</td>
                  <td className="p-4">{item.category}</td>
                  <td className="p-4">{item.onHandGrams}</td>
                  <td className="p-4">{item.reservedGrams}</td>
                  <td className="p-4">{item.availableGrams}</td>
                  <td className="p-4">{item.lowStockThreshold}</td>
                  <td className="p-4">
                    <span className={`rounded-[5px] px-2 py-1 text-xs font-black ${low ? "bg-[#fff0ee] text-[#d63f3f]" : "bg-[#effbf5] text-[#247b55]"}`}>
                      {low ? "Low stock" : "In stock"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </PageChrome>
  );
}
