import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import * as jose from 'jose';

const base64Secret = process.env.JWT_SECRET as string;
const secret = Buffer.from(base64Secret, 'base64');

export async function middleware(req: NextRequest) {
    const cookieStore = cookies();
    const jwtToken = cookieStore.get(process.env.NEXT_PUBLIC_COOKIE_NAME as string);
    let isAuthenticated = false;
    if (jwtToken?.value) {
        try {
            const decode = await jose.jwtVerify(jwtToken.value, secret);
            if (decode.payload) {
                isAuthenticated = true;
            }
        } catch (e) {
            isAuthenticated = false;
        }
    }

    const url = req.nextUrl.clone();

    if (isAuthenticated) {
        if (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register') {
            url.pathname = '/';
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    if (!isAuthenticated && (req.nextUrl.pathname !== '/login' && req.nextUrl.pathname !== '/register')) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!assets/|_next/static|_next/image|favicon.ico|manifest.json|firebase-messaging-sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ]
}