import {Skeleton} from "@/components/ui/skeleton";

export function LoadingSkeleton() {
    return (
        <>
            {Array.from({length: 3}).map((_, index) => (
                <div key={index} className="space-y-4 mb-3">
                    <Skeleton className="h-6 w-1/2"/>
                    <Skeleton className="h-4 w-3/4"/>
                    <Skeleton className="h-8 w-full"/>
                </div>
            ))}
        </>
    );
}