import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const role = request.cookies.get('role')?.value;

    const { pathname } = request.nextUrl;
    const publicPaths = ['/login', '/register'];

    if (!token) {

        if (!publicPaths.includes(pathname)) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }
    if(token && role) {
        if(publicPaths.includes(pathname)) {
            if (role === 'USER') {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            } else if (role === 'ADMIN') {
                return NextResponse.redirect(new URL('/adminDashboard', request.url));
            }
        }
        return NextResponse.next();
    }

}
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};