'use client'
import {ReactNode} from "react";
import {useUserAppContext} from "@/lib/context/auth/user-context";

export default function DashboardCompanyName(): ReactNode {
    const appContext = useUserAppContext();
    return (
        <>
            {appContext.user()?.business.name || 'NOMBRE_EMPRESA'}
        </>
    )
}