import {createServerClient} from '@supabase/ssr'
import {type NextRequest, NextResponse} from 'next/server'
import {User} from "@supabase/auth-js";
import {businessHasActiveSubscription} from "@/_lib/supabase/admin";

const PublicPath: string[] = [
    '/auth/callback',
    '/login',
];

export async function updateSession(req: NextRequest) {
    let response = NextResponse.next({
        request: req,
    })

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
                    cookiesToSet.forEach(({name, value, options}) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {data: {user}, error} = await supabase.auth.getUser();

    let isAuthenticated = false;
    if (user?.id) {
        isAuthenticated = true;
    }

    const url = req.nextUrl.clone();

    if (error && (url.pathname !== '/login' && url.pathname !== '/auth/callback')) {
        url.pathname = '/login';
        return NextResponse.redirect(url, 301);
    }
    if (PublicPath.includes(req.nextUrl.pathname) && !isAuthenticated) {
        return response;
    }

    if (!isAuthenticated) {
        url.pathname = '/login';
        return NextResponse.redirect(url, 301);
    }

    if (isAuthenticated && user) {
        const redirectUrl = userRequireMetadata(user, req);
        if (redirectUrl.redirectUrl) {
            url.pathname = redirectUrl.redirectUrl;
            return NextResponse.redirect(url, 301);
        }

        if (redirectUrl.required) {
            return response;
        }

        const hasActiveSubscription = await businessHasActiveSubscription(user.id);

        if (hasActiveSubscription && req.nextUrl.pathname === '/subscription') {
            url.pathname = '/';
            return NextResponse.redirect(url, 301);
        }

        if (!hasActiveSubscription && req.nextUrl.pathname !== '/subscription') {
            url.pathname = '/subscription';
            return NextResponse.redirect(url, 301);
        } else if (!hasActiveSubscription && req.nextUrl.pathname === '/subscription') {
            return response;
        }

        if ((user.user_metadata.hasBusiness && user.user_metadata.hasBusinessLocal) &&
            (user?.user_metadata.current_session === null ||
                user.user_metadata.current_session == undefined)) {
            if (req.nextUrl.pathname !== '/mybusiness') {
                url.pathname = '/mybusiness';
                return NextResponse.redirect(url, 301);
            }
        }

        if (hasActiveSubscription) {
            return response
        }

        if (req.nextUrl.pathname.startsWith('/login')) {
            url.pathname = '/';
            return NextResponse.redirect(url, 301);
        }
    }
    return response;
}

function userRequireMetadata(user: User, req: NextRequest): { redirectUrl?: string, required?: boolean } {
    const currentPath = req.nextUrl.pathname;

    if ((user?.user_metadata.full_name === undefined || user?.user_metadata.full_name === null)) {
        if (currentPath !== '/register/profile') {
            return {
                redirectUrl: '/register/profile',
            };
        }
        return {
            required: true
        };
    }

    if (!user?.user_metadata.hasBusiness && !user?.user_metadata.hasBusinessLocal) {
        if (currentPath !== '/register/business') {
            return {
                redirectUrl: '/register/business',
            };
        }
        return {
            required: true
        };
    }

    if (user?.user_metadata.hasBusiness && !user?.user_metadata.hasBusinessLocal) {
        if (currentPath !== '/register/local') {
            return {
                redirectUrl: '/register/local',
            };
        }
        return {
            required: true
        };    }
    return {
        required: false
    };}