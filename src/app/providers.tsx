'use client'

import {ReactNode, useState} from "react";
import {ThemeProvider} from "next-themes";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

export function Providers({children}: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions:{
            queries: {
                staleTime: 60 * 1000,
                refetchInterval: 60 * 1000
            }
        }
    }));
    return (
        <ThemeProvider attribute={"class"} defaultTheme={"dark"} enableSystem>
            <QueryClientProvider client={queryClient}>
                    {children}
                { process.env.NODE_ENV === "development" && <ReactQueryDevtools/>}
            </QueryClientProvider>
        </ThemeProvider>
    )
}