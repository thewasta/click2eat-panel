import React, {Suspense} from "react";
import Loading from "@/app/(dashboard)/loading";
import SidebarComponent from "@/components/navbar/sidebar";
import {DashboardHeader} from "@/components/navbar/DashboardHeader";

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>) {
    //const responsiveBreakpoint: string = "sm:bg-indigo-500 md:bg-red-600 lg:bg-green-300 xl:bg-blue-600 2xl:bg-gray-800";
    return (
        <Suspense fallback={<Loading/>}>
            <div className={"min-h-screen grid grid-cols-1 md:grid-cols-5 lg:grid-cols-7"}>
                <SidebarComponent/>
                <div
                    className={"lg:col-span-6 md:col-span-4 col-span-1 w-full overflow-x-hidden"}>
                    {/* Header   */}
                    <DashboardHeader/>
                    {/*Dashboard content*/}
                    {/*<ScrollArea type={"scroll"} className={"h-[calc(90vh+30px)] w-full"}>*/}
                    <div className={'p-3 md:p-12 max-w-full'}>
                        {children}
                    </div>
                    {/*</ScrollArea>*/}
                </div>
            </div>
        </Suspense>
    );
}