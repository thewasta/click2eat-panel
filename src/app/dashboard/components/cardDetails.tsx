import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ReactNode} from "react";

interface IDashboardCardDetails {
    title: string;
    value: string;
    description?: string;
    icon?: ReactNode
}

export default async function DashboardCardDetail(props: IDashboardCardDetails) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {props.title}
                </CardTitle>
                {props.icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{props.value}</div>
                <p className="text-xs text-muted-foreground">
                    {props.description}
                </p>
            </CardContent>
        </Card>
    );
}