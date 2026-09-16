import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// Protects everything under /admin (except /admin/login) behind a real
// Supabase session. Also refreshes the auth cookie on every navigation so
// Server Components always see an up-to-date session.
//
// Next.js 16 renamed the `middleware.js` file convention to `proxy.js`
// (same behavior, same request/response shape — just a rename of the file
// and the exported function). This file replaces the old middleware.js.
export async function proxy(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLoginPath = pathname === "/admin/login";
  // Both must stay reachable without an existing session: forgot-password is
  // how you request a reset link in the first place, and reset-password is
  // where you land (with a fresh recovery session, established by
  // /auth/confirm) right after clicking that link.
  const isForgotPasswordPath = pathname === "/admin/forgot-password";
  const isResetPasswordPath = pathname === "/admin/reset-password";
  const isPublicAuthPath = isLoginPath || isForgotPasswordPath || isResetPasswordPath;
  const isAdminPath = pathname.startsWith("/admin");

  if (isAdminPath && !isPublicAuthPath && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isLoginPath && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
