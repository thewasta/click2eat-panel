import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import FcmTokenComp from "@/components/firebase/firebaseForeground";
import {Providers} from "@/app/providers";
import {UserAppContextProvider} from "@/lib/context/auth/user-context";
import {ReactNode} from "react";
import {Toaster} from "@/components/ui/sonner";

const inter = Roboto({
    weight: ['100', '300', '400', '500', '700', '900'],
    subsets: ['latin'],
    display: "swap",
    adjustFontFallback: false
},);

export const metadata: Metadata = {
    title: {
        default: 'Click2Eat - Gestiona tu restaurante de forma sencilla',
        template: 'Click2Eat - %s'
    },
    description: "Gestiona tu restaurante de forma sencilla",
    manifest: '/manifest.json',
    icons: {
        'apple': '/icons/apple-touch-icon.png',
    },
    robots: {
        follow: false,
        index: false
    }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className}`}>
            <Providers initialSession={null}>
                <FcmTokenComp/>
                <UserAppContextProvider>
                    {children}
                </UserAppContextProvider>
            </Providers>
            <Toaster/>
        </body>
    </html>
  );
}
