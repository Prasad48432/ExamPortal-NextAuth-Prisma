import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  console.log("session is", session);
  return NextResponse.json({ authenticated: !!session });
}
