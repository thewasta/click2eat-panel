import {type CookieOptions, createServerClient} from '@supabase/ssr'
import {type NextRequest, NextResponse} from 'next/server'
import {PublicPath} from "@/_lib/constants/RoutePathname";
import {User} from "@supabase/auth-js";

export async function updateSession(req: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: req.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return req.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    req.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: req.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    req.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: req.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
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
        await supabase.auth.signOut();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }
    if (PublicPath.includes(req.nextUrl.pathname) && !isAuthenticated) {
        return response;
    }

    if (!isAuthenticated) {
        console.log('no está autenticado');
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    if (isAuthenticated && user) {
        const redirectUrl = userRequireMetadata(user, req);
        if (redirectUrl) {
            url.pathname = redirectUrl;
            return NextResponse.redirect(url);
        }
        if (req.nextUrl.pathname !== '/dashboard') {
            url.pathname = '/dashboard';
            return NextResponse.redirect(url);
        }
    }
    return response;
}

function userRequireMetadata(user: User, req: NextRequest) {
    const currentPath = req.nextUrl.pathname;

    if ((user?.user_metadata.full_name === undefined || user?.user_metadata.full_name === null) &&
        currentPath !== '/register/profile'
    ) {
        return '/register/profile';
    }

    if (!user?.user_metadata.hasBusiness && !user?.user_metadata.hasBusinessLocal &&
        currentPath !== '/register/business'
    ) {
        return '/register/business';
    }

    if (user?.user_metadata.hasBusiness && !user?.user_metadata.hasBusinessLocal &&
        currentPath !== '/register/local'
    ) {
        return '/register/local';
    }

    return null;
}