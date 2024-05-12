import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import FcmTokenComp from "@/components/firebase/firebaseForeground";
import {Providers} from "@/app/providers";
import {UserAppContextProvider} from "@/lib/context/auth/user-context";
import {ReactNode} from "react";

const inter = Roboto({weight: ['100', '300', '400','500','700','900'],subsets:['latin']});

export const metadata: Metadata = {
    title: "Click2Eat - Gestiona tu restaurante de forma sencilla",
    description: "Gestiona tu restaurante de forma sencilla",
    manifest: '/manifest.json',
    icons: {
        'apple': '/icons/apple-touch-icon.png',
    }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} overflow-hidden`}>
            <Providers>
            <FcmTokenComp/>
            <UserAppContextProvider>
                {children}
            </UserAppContextProvider>
            </Providers>
        </body>
    </html>
  );
}
