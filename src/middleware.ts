import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export async function middleware(request: NextRequest) {
  // next-intl handler (called conditionally below)
  const handleI18nRouting = createMiddleware(routing);

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const requestedPath = request.nextUrl.pathname;
  const requestedSearch = request.nextUrl.search || "";

  // Detect locale prefix and normalize path for route checks
  const segments = requestedPath.split("/").filter(Boolean);
  const maybeLocale = segments[0];
  const hasLocalePrefix = routing.locales.includes(maybeLocale as any);
  const locale = hasLocalePrefix ? maybeLocale : null;
  const normalizedPath = hasLocalePrefix
    ? `/${segments.slice(1).join("/")}` || "/"
    : requestedPath;

  const publicRoutes = new Set(["/", "/login", "/register"]);

  const isPublicRoute = publicRoutes.has(normalizedPath);
  if (!isAuthenticated && !isPublicRoute) {
    const loginPath = locale ? `/${locale}/login` : "/login";
    const redirectUrl = new URL(loginPath, request.url);
    redirectUrl.searchParams.set(
      "callbackUrl",
      `${requestedPath}${requestedSearch}`
    );
    return NextResponse.redirect(redirectUrl);
  }

  const authPages = new Set(["/login", "/register"]);
  if (isAuthenticated && authPages.has(normalizedPath)) {
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
    const defaultTarget = locale ? `/${locale}` : "/";
    return NextResponse.redirect(
      new URL(callbackUrl || defaultTarget, request.url)
    );
  }

  // Run next-intl middleware only on locale-prefixed paths for now
  // (prevents unintended redirects while app routes are still unprefixed)
  if (hasLocalePrefix) {
    return handleI18nRouting(request);
  }

  return NextResponse.next();
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
