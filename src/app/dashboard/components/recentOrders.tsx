import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import RecentOrderItem from "@/app/dashboard/components/recentOrderItem";

type Order = {
    location: string;
    by: string;
    time: string;
    totalValue: string;
}

interface IRecentOrders {
    orders: Order[]
}

export default async function RecentOrders(props: IRecentOrders) {
    const orders = [
        ...props.orders.slice(0, 6)
    ];
    return (
        <Card className="col-span-4 md:col-span-3">
            <CardHeader>
                <CardTitle>Comandas Recientes</CardTitle>
                <CardDescription>
                    265 ventas este mes.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className={'space-y-3'}>
                    {
                        !!orders.length && orders.map((order, index) => (
                            <RecentOrderItem order={order} key={index}/>
                        ))
                    }
                </div>
            </CardContent>
        </Card>
);
}
