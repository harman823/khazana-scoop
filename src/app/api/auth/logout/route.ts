import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clearSessionCookie } from "@/lib/api-utils";
import { SESSION_COOKIE_NAME, logoutUser } from "@/lib/production-store";

export async function POST(): Promise<NextResponse> {
  const cookieStore = await cookies();
  await logoutUser(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  return response;
}
