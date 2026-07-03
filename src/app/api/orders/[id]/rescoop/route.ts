import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api-utils";
import { getOrder, triggerReScoop } from "@/lib/production-store";
import { canReScoop } from "@/lib/order-state";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext): Promise<NextResponse> {
  const { id } = await context.params;
  try {
    const existing = await getOrder(id);
    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (!canReScoop(existing)) {
      return NextResponse.json({ error: "Re-scoop window is unavailable" }, { status: 409 });
    }
    const order = await triggerReScoop(id);
    return NextResponse.json({ order });
  } catch (error) {
    return jsonError(error);
  }
}
