import {createServerClient} from '@supabase/ssr'
import {type NextRequest, NextResponse} from 'next/server'
import {User} from "@supabase/auth-js";
import {businessHasActiveSubscription} from "@/_lib/supabase/admin";

const PUBLIC_PATHS: string[] = ['/auth/callback'];
const LOGIN_PATH = '/login';
const REGISTRATION_PATHS: string[] = ['/register/profile', '/register/business', '/register/local'];
const SUBSCRIPTION_PATH = '/subscription';
const MY_BUSINESS_PATH = '/mybusiness';

export async function updateSession(req: NextRequest) {
    const { pathname } = req.nextUrl;
    let response = NextResponse.next({
        request: req,
    })

    // Allow POST requests (potential server actions) to pass through
    if (req.method === 'POST') {
        return response;
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({name, value, options}) => req.cookies.set(name, value))
                    response = NextResponse.next({
                        request: req,
                    })
                },
            },
        }
    )

    const { data: { user }, error } = await supabase.auth.getUser();

    if (pathname === LOGIN_PATH) {
        if (user) {
            return NextResponse.redirect(new URL(MY_BUSINESS_PATH, req.url));
        }
        return response;
    }

    if (PUBLIC_PATHS.includes(pathname)) {
        return response;
    }

    if (error || !user) {
        return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
    }

    const redirectUrl = checkRegistrationSteps(user);
    if (redirectUrl && !REGISTRATION_PATHS.includes(pathname)) {
        return NextResponse.redirect(new URL(redirectUrl, req.url));
    }

    if (!redirectUrl) {
        const hasActiveSubscription = await businessHasActiveSubscription(user.id);

        if (!hasActiveSubscription && pathname !== SUBSCRIPTION_PATH) {
            return NextResponse.redirect(new URL(SUBSCRIPTION_PATH, req.url));
        }

        if (hasActiveSubscription && needsToSelectLocal(user) && pathname !== MY_BUSINESS_PATH) {
            return NextResponse.redirect(new URL(MY_BUSINESS_PATH, req.url));
        }
    }

    return response;
}

function checkRegistrationSteps(user: User): string | null {
    const { user_metadata } = user;

    if (!user_metadata.full_name) {
        return '/register/profile';
    }

    if (!user_metadata.hasBusiness) {
        return '/register/business';
    }

    if (!user_metadata.hasBusinessLocal) {
        return '/register/local';
    }

    return null;
}

function needsToSelectLocal(user: User): boolean {
    const { user_metadata } = user;
    return user_metadata.hasBusiness &&
        user_metadata.hasBusinessLocal &&
        (user_metadata.current_session === null || user_metadata.current_session === undefined);
}