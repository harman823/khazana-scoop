import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api-utils";
import { updateOrderStatus } from "@/lib/production-store";
import { statusSchema } from "@/lib/validation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext): Promise<NextResponse> {
  const { id } = await context.params;
  const parsed = statusSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status payload" }, { status: 400 });
  }
  try {
    const order = await updateOrderStatus(id, parsed.data.status);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch (error) {
    return jsonError(error);
  }
}
