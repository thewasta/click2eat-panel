'use client'
import {
    ColumnDef,
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState
} from "@tanstack/table-core";
import {flexRender, useReactTable} from "@tanstack/react-table";
import {ChangeEvent, ReactNode, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {TableSkeletonColumns} from "@/components/ui/table-skeleton-columns";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isLoading: boolean
    entityName: string;
    searchBy: string;
    buttonAction: ReactNode,
    pagination: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void
    },
    sorting: {
        sortBy: string;
        sortOrder: string;
        onSort: (column: string) => void
    }
    onSearch: (searchTerm: string) => void
}

export function ProductTable<TData, TValue>({
                                                columns,
                                                data,
                                                isLoading,
                                                entityName,
                                                onSearch,
                                                buttonAction,
                                                pagination,
                                            }: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualSorting: true,
        manualPagination: true,
        manualFiltering: true,
        onColumnFiltersChange: setColumnFilters,
        state: {
            columnFilters
        }
    });

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value;
        onSearch(searchTerm);
    }
    return (
        <>
            <div className="flex gap-1 items-center py-4 join">
                <Input
                    className={"w-1/3"}
                    type={"text"}
                    name={"filter"}
                    placeholder={`Nombre ${entityName}...`}
                    onChange={handleSearch}
                />
                {buttonAction}
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
                            data &&
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
                                <TableSkeletonColumns columns={6} rows={4}/>
                            )
                        }
                        {
                            (!isLoading && data?.length === 0) &&
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
                <div className={"space-x-2"}>
                    <Button
                        onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                    >Atrás
                    </Button>
                    <Button
                        onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                    >Siguiente
                    </Button>
                </div>
            </div>
        </>
    )
}