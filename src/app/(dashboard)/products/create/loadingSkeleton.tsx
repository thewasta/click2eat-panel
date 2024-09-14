import {Skeleton} from "@/components/ui/skeleton";

export function LoadingSkeleton() {
   return (
       <>
           {Array.from({length: 2}).map((_, index) => (
               <div key={index} className="flex space-x-4">
                   <Skeleton className="h-4 w-[250px]"/>
                   <Skeleton className="h-4 w-[200px]"/>
               </div>
           ))}
       </>
   );
}