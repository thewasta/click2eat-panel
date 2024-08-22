import {createServerClient} from '@supabase/ssr'
import {type NextRequest, NextResponse} from 'next/server'
import {User} from "@supabase/auth-js";

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
        return NextResponse.redirect(url);
    }
    if (PublicPath.includes(req.nextUrl.pathname) && !isAuthenticated) {
        return response;
    }

    if (!isAuthenticated) {
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    if (isAuthenticated && user) {
        const redirectUrl = userRequireMetadata(user, req);
        if (redirectUrl) {
            url.pathname = redirectUrl;
            return NextResponse.redirect(url);
        }

        if (req.nextUrl.pathname.startsWith('/login')) {
            url.pathname = '/';
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
        user?.user_metadata.full_name !== undefined &&
        currentPath !== '/register/business'
    ) {
        return '/register/business';
    }

    if (user?.user_metadata.hasBusiness && !user?.user_metadata.hasBusinessLocal &&
        user?.user_metadata.full_name !== undefined &&
        currentPath !== '/register/local'
    ) {
        return '/register/local';
    }

    if ((user.user_metadata.hasBusiness && user.user_metadata.hasBusinessLocal) &&
        (user?.user_metadata.current_session === null ||
            user.user_metadata.current_session == undefined) &&
        currentPath !== '/mybusiness') {
        return '/mybusiness';
    }
    return null;
}