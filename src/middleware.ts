import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'imob_admin_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // For�ar Cache-Control agressivo e imut�vel para assets est�ticos e uploads
  if (pathname.startsWith('/assets/') || pathname.startsWith('/uploads/')) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    return response;
  }

  // Protege a rota do painel administrativo
  if (pathname.startsWith('/dashboard')) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verifica formato b�sico do token (payload.signature)
    const parts = sessionCookie.split('.');
    if (parts.length !== 2) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete(SESSION_COOKIE_NAME);
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/assets/:path*', '/uploads/:path*'],
};
