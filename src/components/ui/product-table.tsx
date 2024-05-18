'use client'
import {
    ColumnDef, getCoreRowModel, getPaginationRowModel,
    SortingState, getSortedRowModel, ColumnFiltersState,
    getFilteredRowModel
} from "@tanstack/table-core";
import {flexRender, useReactTable} from "@tanstack/react-table";
import {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {useQuery} from "@tanstack/react-query";
import {retrieveProducts} from "@/_request/product/productRetriever";
import {log} from "node:util";
import {User} from "@/lib/models/Account/User";
import {Skeleton} from "@/components/ui/skeleton";
import {useUserAppContext} from "@/lib/context/auth/user-context";
import {toast} from "sonner";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
}

export function ProductTable<TData, TValue>({columns}: DataTableProps<TData, TValue>) {

    const {user} = useUserAppContext();
    const {data: products, error, isLoading} = useQuery({
        queryKey: ["products", user()?.business.businessUuid],
        queryFn: async () => retrieveProducts(),
        refetchInterval: 15 * 1000, // Every minutes
        retry: false
    });
    
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const table = useReactTable({
        data: products?.message as TData || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters
        }
    });

    return (
        <>
            <div className="flex gap-1 items-center py-4 join">
                <Input
                    className={"w-1/3"}
                    type={"text"}
                    name={"filter"}
                    placeholder="Nombre producto..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                />
                <Button asChild>
                    <Link
                        href={"/dashboard/menu/create"}
                    >
                        Crear producto
                    </Link>
                </Button>
            </div>
            <div className={"rounded-md border"}>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {
                            products &&
                            (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )
                        }
                        {
                            isLoading &&
                            (
                                <>
                                    <TableRow>
                                        {
                                            columns.map((col, index) => (
                                                <TableCell key={index}>
                                                    <Skeleton className="h-4 w-full"/>
                                                </TableCell>
                                            ))
                                        }
                                    </TableRow>
                                </>
                            )
                        }
                        {
                            products?.message.length === 0 &&
                            (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </div>
            <div className={"w-full flex justify-end mt-4"}>
                <div className={"join"}>
                    <Button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >Atrás
                    </Button>
                    <Button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >Siguiente
                    </Button>
                </div>
            </div>
        </>
    )
}