'use client'

import {ReactNode, useState} from "react";
import {ThemeProvider} from "next-themes";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {SessionContextProvider} from "@supabase/auth-helpers-react";
import {createClient} from "@/_lib/supabase/client";

export function Providers({children, initialSession}: { children: ReactNode, initialSession: any }) {
    const supabase = createClient()

    const [queryClient] = useState(() => new QueryClient({
        defaultOptions:{
            queries: {
                staleTime: 60 * 1000,
                refetchInterval: 60 * 1000
            }
        }
    }));
    return (
        <SessionContextProvider supabaseClient={supabase} initialSession={initialSession}>
            <ThemeProvider attribute={"class"} defaultTheme={"dark"} enableSystem>
                <QueryClientProvider client={queryClient}>
                    {children}
                    { process.env.NODE_ENV === "development" && <ReactQueryDevtools/>}
                </QueryClientProvider>
            </ThemeProvider>
        </SessionContextProvider>
    )
}