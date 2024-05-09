import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import FcmTokenComp from "@/components/firebase/firebaseForeground";

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
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body className={`${inter.className} overflow-hidden`}>
            <FcmTokenComp/>
            {children}
        </body>
    </html>
  );
}
