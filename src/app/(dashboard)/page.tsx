import DashboardUserName from "@/components/dashboard/userName";
import DashboardCompanyName from "@/components/dashboard/companyName";
import DashboardCardDetail from "@/components/dashboard/cardDetail";
import {Activity, DollarSign} from "lucide-react";
import {IoPeopleOutline} from "react-icons/io5";
import DashboardRecentOrders from "@/components/dashboard/recentOrders";
import DashboardMostSell from "@/components/dashboard/mostSell";
import {Product} from "@/_request/product/model/product";


const exampleOrders = [
    {by: 'Olivia Tea', location: '01', time: '9:30am', totalValue: '15'},
    {by: 'Olivia Tea', location: '01', time: '9:30am', totalValue: '15'},
    {by: 'Olivia Tea', location: '01', time: '9:30am', totalValue: '15'},
]
const exampleProducts: Product[] = [
    {
        description: 'Example description',
        name: 'Hamburguesa',
        businessUuid: '',
        category: 'Example category',
        highlight: false,
        images: [],
        price: 17,
        id: 'Example-Uid-Product',
        offerPrice: 0,
        publishDate: null,
        status: 'ACTIVE',
        subCategory: ''
    }
]
export default function HomeDashboard() {
    return (
        <>
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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <div className={'col-span-1 md:col-span-4'}>
                        <DashboardMostSell products={exampleProducts}/>
                    </div>
                    <div className={'col-span-1 md:col-span-3'}>
                        <DashboardRecentOrders orders={exampleOrders}/>
                    </div>
                </div>
            </div>
        </>
    )
}