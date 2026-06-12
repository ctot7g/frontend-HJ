import { NextResponse, NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const ref = searchParams.get('ref');

  if (ref) {
    const url = request.nextUrl.clone();
    url.searchParams.delete('ref');

    const response = NextResponse.redirect(url);
    response.cookies.set('ref_code', ref, {
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 90,
      path: '/',
      sameSite: 'lax',
    });
    return response;
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    // Apply this middleware to these paths
    "/profile",
    // You can exclude paths from middleware
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
