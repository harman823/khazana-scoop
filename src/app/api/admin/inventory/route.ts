import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api-utils";
import { listInventory, updateInventory } from "@/lib/production-store";
import { inventoryUpdateSchema } from "@/lib/validation";

export async function GET(): Promise<NextResponse> {
  try {
    return NextResponse.json({ inventory: await listInventory() });
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: Request): Promise<NextResponse> {
  const parsed = inventoryUpdateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid inventory payload" }, { status: 400 });
  }
  try {
    const item = await updateInventory(
      parsed.data.itemId,
      parsed.data.onHandGrams,
      parsed.data.reservedGrams,
      parsed.data.lowStockThreshold,
    );
    if (!item) {
      return NextResponse.json({ error: "Inventory item not found" }, { status: 404 });
    }
    return NextResponse.json({ item });
  } catch (error) {
    return jsonError(error);
  }
}
