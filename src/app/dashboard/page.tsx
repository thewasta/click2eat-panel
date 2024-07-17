import {createClient} from "@/lib/supabase/server";
import ShopNameComponent from "@/app/dashboard/components/shopNameComponent";
import {Activity, DollarSign} from "lucide-react";
import DashboardCardDetail from "@/app/dashboard/components/cardDetails";
import {IoPeopleOutline} from "react-icons/io5";
import RecentOrders from "@/app/dashboard/components/recentOrders";

const orders = [
    {by: 'Olivia Tea', location: '01', time: '9:30am', totalValue: '15'},
    {by: 'Olivia Tea', location: '01', time: '9:30am', totalValue: '15'},
    {by: 'Olivia Tea', location: '01', time: '9:30am', totalValue: '15'},
]
export default async function HomeDashboard() {
    const client = createClient();
    const {data: {user}} = await client.auth.getUser();

    return (
        <div className="col-span-2 space-y-4">
            <section>
                <p className="font-bold text-xl">
                    Buenos días, {user?.user_metadata.full_name ?? '[SESSION_USER_NAME]'}.
                </p>
                <span className="text-gray-500 text-sm">
                    Esto es lo que está sucediendo hoy en <ShopNameComponent/>
                </span>
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className={'col-span-4'}>
                </div>
                <div className={'col-span-4 md:col-span-3'}>
                    <RecentOrders orders={orders}/>
                </div>
            </div>
        </div>
    )
}