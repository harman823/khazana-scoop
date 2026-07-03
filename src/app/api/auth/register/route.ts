import { NextResponse } from "next/server";
import { jsonError, setSessionCookie } from "@/lib/api-utils";
import { registerUser } from "@/lib/production-store";
import { registerSchema } from "@/lib/validation";

export async function POST(request: Request): Promise<NextResponse> {
  const parsed = registerSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid registration payload" }, { status: 400 });
  }
  try {
    const session = await registerUser(parsed.data.name, parsed.data.email, parsed.data.password);
    const response = NextResponse.json({ user: session.user });
    setSessionCookie(response, session.token, session.expiresAt);
    return response;
  } catch (error) {
    return jsonError(error);
  }
}
