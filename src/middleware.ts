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
  const requestedPage = request.nextUrl.pathname;
  const publicRoutes = ["/", "/login", "/register"];

  const isPublicRoute = publicRoutes.includes(requestedPage);
  if (!isAuthenticated && !isPublicRoute) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("callbackUrl", requestedPage);
    return NextResponse.redirect(redirectUrl);
  }

  const authPages = ["/login", "/register"];
  if (isAuthenticated && authPages.includes(requestedPage)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|assets|images|fonts).*)",
  ],
};
