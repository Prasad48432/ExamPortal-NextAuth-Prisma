import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  if (url.pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/dashboard/home", req.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/dashboard"], // Apply middleware only to /dashboard
};
