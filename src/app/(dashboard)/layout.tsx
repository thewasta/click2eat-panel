import type {Metadata} from "next";
import React, {Suspense} from "react";
import Loading from "@/app/(dashboard)/loading";
import NavBarComponent from "@/components/navbar/NavBarComponent";

export const metadata: Metadata = {
    title: 'Panel Administración',
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    //const responsiveBreakpoint: string = "sm:bg-indigo-500 md:bg-red-600 lg:bg-green-300 xl:bg-blue-600 2xl:bg-gray-800";
    return (
        <Suspense fallback={<Loading/>}>
            <NavBarComponent/>
            {/*Dashboard content*/}
            {/*<ScrollArea type={"scroll"} className={"h-[calc(90vh+30px)] w-full"}>*/}
            <div className={'p-3 md:p-12 max-w-full'}>
                {children}
            </div>
        </Suspense>
    );
}