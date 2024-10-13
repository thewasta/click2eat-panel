'use client'

import {ReactNode, useState} from "react";
import {ThemeProvider} from "next-themes";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {SessionContextProvider} from "@supabase/auth-helpers-react";
import {createClient} from "@/_lib/supabase/client";
import {NextUIProvider} from "@nextui-org/system";

export function Providers({children, initialSession}: { children: ReactNode, initialSession: any }) {
    const supabase = createClient()

    const [queryClient] = useState(() => new QueryClient({
        defaultOptions:{
            queries: {
                retry: false,
                staleTime: 60 * 3000, // 3 minutes
                refetchInterval: 60 * 3000, // 3 minutes
                refetchOnWindowFocus: 'always',
                refetchOnReconnect: true,
                refetchOnMount: false,
                refetchIntervalInBackground: false
            }
        }
    }));
    return (
        <SessionContextProvider supabaseClient={supabase} initialSession={initialSession}>
            <NextUIProvider>
                <ThemeProvider attribute={"class"} defaultTheme={"dark"} enableSystem>
                    <QueryClientProvider client={queryClient}>
                        {children}
                        {process.env.NODE_ENV === "development" && <ReactQueryDevtools/>}
                    </QueryClientProvider>
                </ThemeProvider>
            </NextUIProvider>
        </SessionContextProvider>
    )
}