import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('user_session')?.value;

  const url = request.nextUrl.clone();
  if (!isLoggedIn && !url.pathname.startsWith('/login')) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/produk/:path*', '/transaksi/:path*', '/laporan/:path*', '/pelanggan/:path*'],
};
