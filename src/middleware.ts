import {NextRequest} from "next/server";
import {updateSession} from "@/_lib/supabase/middleware";


export async function middleware(req: NextRequest) {
    return await updateSession(req);
}

export const config = {
    matcher: [
        '/((?!api/webhooks/stripe|assets/|_next/static|_next/image|favicon.ico|manifest.json|firebase-messaging-sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ]
}