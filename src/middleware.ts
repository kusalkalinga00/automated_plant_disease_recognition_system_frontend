import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const requestedPath = request.nextUrl.pathname;
  const requestedSearch = request.nextUrl.search || "";
  const publicRoutes = new Set(["/", "/login", "/register"]);

  const isPublicRoute = publicRoutes.has(requestedPath);
  if (!isAuthenticated && !isPublicRoute) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set(
      "callbackUrl",
      `${requestedPath}${requestedSearch}`
    );
    return NextResponse.redirect(redirectUrl);
  }

  const authPages = new Set(["/login", "/register"]);
  if (isAuthenticated && authPages.has(requestedPath)) {
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    return NextResponse.redirect(new URL(callbackUrl || "/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|assets|images|fonts).*)",
  ],
};
