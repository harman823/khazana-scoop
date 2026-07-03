import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api-utils";
import { acceptScoop } from "@/lib/production-store";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext): Promise<NextResponse> {
  const { id } = await context.params;
  try {
    const order = await acceptScoop(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch (error) {
    return jsonError(error);
  }
}
