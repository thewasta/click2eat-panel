import {Avatar, AvatarFallback} from "@/components/ui/avatar";

type Order = {
    location: string;
    by: string;
    time: string;
    totalValue: string;
}

interface IRecentOrderItem {
    order: Order
}

export default function RecentOrderItem(props: IRecentOrderItem) {
    return (
        <div className={'flex items-center'}>
            <Avatar>
                <AvatarFallback>{props.order.location}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">Mesa: 1 Atendida por: {props.order.by}</p>
                <p className="text-sm text-muted-foreground">
                    {props.order.time}
                </p>
            </div>
            <div className="ml-auto font-medium">+{props.order.totalValue}</div>
        </div>
    );
}