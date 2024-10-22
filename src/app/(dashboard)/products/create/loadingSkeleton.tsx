import {Skeleton} from "@/components/ui/skeleton";
import {Card, CardBody} from "@nextui-org/card";

export function LoadingSkeleton() {
    return (
        <Card>
            <CardBody className={"grid grid-cols-2 gap-5 md:grid-cols-4"}>
                <div className="h-[50px] w-full col-span-2 md:col-span-4 gap-3 flex justify-end">
                    <Skeleton className={"h-[40px] w-[140px]"} />
                    <Skeleton className={"h-[40px] w-[140px]"} />
                </div>
                <Skeleton className="h-[50px] w-full col-span-2 md:col-span-1"/>
                <Skeleton className="h-[50px] w-full col-span-2 md:col-span-3"/>
                <Skeleton className="h-[50px] w-full col-span-1"/>
                <Skeleton className="h-[50px] w-full col-span-1"/>
                <Skeleton className="h-[50px] w-full col-span-1"/>
                <Skeleton className="h-[50px] w-full col-span-1"/>
                <Skeleton className="h-[50px] w-full col-span-2"/>
                <Skeleton className="h-[80px] w-full col-span-2"/>
                <Skeleton className="h-[50px] w-full col-span-2"/>
                <Skeleton className="h-[80px] w-full col-span-2"/>
                <Skeleton className="h-[50px] w-full col-span-2"/>
                <Skeleton className="h-[50px] w-full col-span-1"/>
                <Skeleton className="h-[50px] w-full col-span-1"/>
                <Skeleton className="h-[50px] w-full col-span-1"/>
            </CardBody>
        </Card>
    );
}