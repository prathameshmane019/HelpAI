import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, decodeJwt } from "jose";
 

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;
 
  // Allow public pages
  if (!token && (path === "/login" || path === "/register")) {
    return NextResponse.next();
  }

  // Redirect to login if no token
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Decode JWT to check role
    const payload = decodeJwt(token);

    // Example role-based access
    if (path.startsWith("/admin") && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url)); // Or unauthorized page
    }

    if (path.startsWith("/agent") && payload.role !== "AGENT") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Add user info to request headers if needed
    const res = NextResponse.next();
    res.headers.set("x-user-role", payload.role as string);
    return res;

  } catch (err) {
    console.error("JWT error:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/agent/:path*" ],
};
