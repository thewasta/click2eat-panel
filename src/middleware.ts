import {NextRequest} from "next/server";
import {updateSession} from "@/_lib/supabase/middleware";


export async function middleware(req: NextRequest) {
    console.log({
        redirect: req.nextUrl.pathname
    })
    return await updateSession(req);
}

export const config = {
    matcher: [
        '/((?!api/webhooks/stripe|monitoring|assets/|_next/static|_next/image|favicon.ico|manifest.json|firebase-messaging-sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ]
}