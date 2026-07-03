import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jsonError } from "@/lib/api-utils";
import { SESSION_COOKIE_NAME, createOrder, listOrders, requireUserFromSession } from "@/lib/production-store";
import { cartSchema } from "@/lib/validation";

export async function GET(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const user = await requireUserFromSession(cookieStore.get(SESSION_COOKIE_NAME)?.value);
    return NextResponse.json({ orders: await listOrders(user.id) });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const parsed = cartSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid order payload" }, { status: 400 });
  }
  try {
    const cookieStore = await cookies();
    const user = await requireUserFromSession(cookieStore.get(SESSION_COOKIE_NAME)?.value);
    const order = await createOrder(user.id, parsed.data);
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
