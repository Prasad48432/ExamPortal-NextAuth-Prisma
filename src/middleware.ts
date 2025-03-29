import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  if (url.pathname === "/dashboard") {
    return NextResponse.redirect(new URL("/dashboard/home", req.url));
  }

  if(url.pathname === "/dashboard/bookmarks"){
    return NextResponse.redirect(new URL("/dashboard/bookmarks/savedexams", req.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/dashboard","/dashboard/bookmarks"],
};
