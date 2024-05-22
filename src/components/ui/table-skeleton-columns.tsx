import {TableCell, TableRow} from "@/components/ui/table";
import React from "react";
import {Skeleton} from "@/components/ui/skeleton";

interface ITableSkeletonColumnsProps {
    columns: number,
    rows: number
}

const range = (end: number) => {
    const start = 0;
    const length = end - start;
    return Array.from({length}, (_, i) => start + i);
}

export function TableSkeletonColumns({columns, rows}: ITableSkeletonColumnsProps): React.ReactNode {

    return range(rows).map((rowNum) => (
        <TableRow key={rowNum}>
            {
                range(columns).map(colNum => (
                    <TableCell key={colNum}>
                        <Skeleton className="h-4 w-full"/>
                    </TableCell>
                ))
            }
        </TableRow>
    ));
}