import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api-utils";
import { attachPackingVideo } from "@/lib/production-store";
import { videoSchema } from "@/lib/validation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext): Promise<NextResponse> {
  const { id } = await context.params;
  const parsed = videoSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid video payload" }, { status: 400 });
  }
  try {
    const order = await attachPackingVideo(id, parsed.data.packingVideoUrl, parsed.data.scoopPhotoUrl);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch (error) {
    return jsonError(error);
  }
}
