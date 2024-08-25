import React, {Suspense} from "react";
import {Loader} from "lucide-react";
import Image from "next/image";
import MiddleLeftSide from "@/components/auth/middleLeftSide";
import MiddleRightSide from "@/components/auth/middleRigthSide";

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <main className="min-h-screen flex items-center justify-center">
            <div className="w-full h-screen flex items-start">
                <MiddleLeftSide>
                    <Suspense fallback={<Loader/>}>
                        <Image
                            src="/assets/auth_main.avif"
                            alt=""
                            width={852}
                            height={520}
                            className="w-full h-full object-cover"
                        />
                    </Suspense>
                </MiddleLeftSide>
                <MiddleRightSide customClass="justify-center flex gap-5">
                    {children}
                </MiddleRightSide>
            </div>
        </main>
    );
}