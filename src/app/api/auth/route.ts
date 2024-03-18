import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import * as jose from "jose";
const base64Secret = process.env.JWT_SECRET as string;
const secret = Buffer.from(base64Secret, 'base64');
export async function POST(req: NextRequest, res: NextResponse) {
    const tokenExpiration = new Date(0);

    const url = req.nextUrl.clone();
    const response = await fetch(`${process.env.BASE_API_URL}/auth/login`,
        {
            method: 'POST',
            body: JSON.stringify({
                username: '',
                password: ''
            })
        }
    );
    const bodyResponse: any = await response.json();
    const jwt: string = bodyResponse.token;
    const decode = await jose.jwtVerify(jwt, secret);
    if (decode && decode.payload && decode.payload.exp) {
        tokenExpiration.setUTCSeconds(decode.payload.exp);
        const cookieStore = cookies();
        cookieStore.set('auth_cookie', jwt, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            expires: tokenExpiration,
            path: '/'
        });
    }
    url.pathname = '/dashboard/home'
    return NextResponse.redirect(url);
}