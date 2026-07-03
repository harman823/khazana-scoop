import { NextResponse } from "next/server";
import { jsonError, setSessionCookie } from "@/lib/api-utils";
import { loginUser } from "@/lib/production-store";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request): Promise<NextResponse> {
  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid login payload" }, { status: 400 });
  }
  try {
    const session = await loginUser(parsed.data.email, parsed.data.password);
    const response = NextResponse.json({ user: session.user });
    setSessionCookie(response, session.token, session.expiresAt);
    return response;
  } catch (error) {
    return jsonError(error);
  }
}
