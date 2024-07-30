"use client"
import DashboardCardDetail from "@/components/dashboard/cardDetail";

import {useUserAppContext} from "@/lib/context/auth/user-context";
export default function HomeDashboard() {
    return (
        <>
            <div className="col-span-2">
                        <span className="font-bold text-xl">
                            Buenos días, {appContext.user && `${appContext.user()?.name} ${appContext.user()?.lastname}`}.
                        </span>
                <p className="text-gray-500 text-sm">
                    Esto es lo que está sucediendo hoy en <span
                    className="underline">{appContext.user()?.business.name || 'NOMBRE_EMPRESA'}</span>
                </p>
                <div className="grid grid-cols-3">
                    Buenos días, {<DashboardUserName/>}
            <div className="space-y-4">
                <section>
                    <span className="font-bold text-xl">
                    Buenos días, {<DashboardUserName/>}
                    </span>
                    <p className="text-gray-500 text-sm">
                        Esto es lo que está sucediendo hoy en <span
                        className="underline">{<DashboardCompanyName/>}</span>
                    </p>
                </section>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <DashboardCardDetail
                        title={'Total ventas'}
                        description={'+20.1% desde mes anterior'}
                        value={'$45,231.89'}
                        icon={<DollarSign className={'h-4 w-4 text-muted-foreground'}/>}
                    />
                    <DashboardCardDetail
                        title={'Clientes'}
                        value={'+35'}
                        description={'+20.1% desde mes anterior'}
                        icon={<IoPeopleOutline className={'h-4 w-4 text-muted-foreground'}/>}
                    />
                    <DashboardCardDetail
                        title={'Activo'}
                        value={'11'}
                        icon={<Activity/>}
                    />
                </div>
            </div>
        </>
    )
}