import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api-utils";
import { getCatalog } from "@/lib/production-store";

export async function GET(): Promise<NextResponse> {
  try {
    return NextResponse.json(await getCatalog());
  } catch (error) {
    return jsonError(error);
  }
}
