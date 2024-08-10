'use client'

import {useUserAppContext} from "@/lib/context/auth/user-context";

export default function DashboardUserName() {
    const appContext = useUserAppContext();

    return (
        <>
            {appContext.user && `${appContext.user()?.name} ${appContext.user()?.lastname}`}.
        </>
    )
}