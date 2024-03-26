import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";

export async function middleware(req: NextRequest) {
    const cookieStore = cookies();
    const jwtToken = cookieStore.get('auth_cookie');
    let isAuthenticated = false;
    if (jwtToken?.value) {
        isAuthenticated = true;
    }

    const url = req.nextUrl.clone();

    // Protegemos rutas que comienzan con '/dashboard/'
    if (req.nextUrl.pathname.startsWith('/dashboard') && !req.nextUrl.pathname.startsWith('/dashboard/auth')) {
        if (!isAuthenticated) {
            url.pathname = '/dashboard/auth/login';
            return NextResponse.redirect(url);
        }
    }
    // Redirigimos a usuarios autenticados que intentan visitar '/auth/login'
    else if (req.nextUrl.pathname.startsWith('/dashboard/auth/login') && isAuthenticated) {
        url.pathname = '/dashboard/home'; // todo redirect to `/dashboard/` instead of `/dashboard/home`
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/api/:path*',
        '/auth/:path*'
    ]
}