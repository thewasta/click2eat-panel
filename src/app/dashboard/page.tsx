"use client"

import {useUserAppContext} from "@/lib/context/auth/user-context";
import {ScrollArea} from "@/components/ui/scroll-area";
export default function HomeDashboard() {
    // const responsiveBreakpoint: string = "sm:bg-indigo-500 md:bg-red-600 lg:bg-green-300 xl:bg-blue-600 2xl:bg-red-800 bg-violet-600";
    const appContext = useUserAppContext();
    return (
        <>
            <div className="col-span-2">
                        <span className="font-bold text-xl">
                            Buenos días, [{appContext.user && appContext.user.username}].
                        </span>
                <p className="text-gray-500 text-sm">
                    Esto es lo que está sucediendo hoy en <span className="underline">[Nombre tienda]</span>
                </p>
                <div className="grid grid-cols-3">
                </div>
            </div>
        </>
    )
}