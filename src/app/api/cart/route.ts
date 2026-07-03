import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api-utils";
import { calculateDatabaseCart } from "@/lib/production-store";
import { cartSchema } from "@/lib/validation";

export async function POST(request: Request): Promise<NextResponse> {
  const parsed = cartSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid cart payload" }, { status: 400 });
  }
  try {
    return NextResponse.json({ cart: await calculateDatabaseCart(parsed.data) });
  } catch (error) {
    return jsonError(error);
  }
}
