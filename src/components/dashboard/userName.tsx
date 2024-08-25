'use client'

// import {useUserAppContext} from "@/lib/context/auth/user-context";
import {useSession} from "@supabase/auth-helpers-react";

export default function DashboardUserName() {
    const session = useSession()
    const ahora = new Date();
    const hora = ahora.getHours();
    const dia = hora >= 6 && hora < 12;
    const tarde = hora >= 12 && hora < 20;
    const noche = hora >= 20 || hora < 6;
    if (dia) {
        return <>
            Buenos días, {session?.user && `${session.user.user_metadata.full_name}`}.
        </>
    } else if (tarde) {
        return <>
            Buenas tardes, {session?.user && `${session.user.user_metadata.full_name}`}.
        </>
    }
    return (
        <>
            Buenas noches, {session?.user && `${session.user.user_metadata.full_name}`}.
        </>
    )
}