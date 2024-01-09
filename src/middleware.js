import { NextResponse } from "next/server";

import { cookies } from "next/headers";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  const stationId = cookies().get("loggedInStation");
  if (request.nextUrl.pathname === "/admin/chats") {
    return NextResponse.redirect(
      new URL(`/admin/chats/${stationId.value}`, request.url)
    );
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/admin/chats",
};
