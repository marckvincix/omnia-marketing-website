import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // L'area admin resta un'isola solo italiana, non gestita da next-intl: qui si
  // applica solo il controllo di autenticazione già esistente.
  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";
    const isProtected = !isLoginPage;

    if (isProtected && !req.auth) {
      const loginUrl = new URL("/admin/login", req.nextUrl.origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isLoginPage && req.auth) {
      return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
    }

    return NextResponse.next();
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
  runtime: "nodejs",
};
