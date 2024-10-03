import {ColumnDef, flexRender, getCoreRowModel, RowSelectionState, useReactTable} from "@tanstack/react-table";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {TableSkeletonColumns} from "@/components/ui/table-skeleton-columns";
import React, {Dispatch, SetStateAction} from "react";

type TableComponentProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    totalColumns: number;
    selectedRow?: RowSelectionState;
    setSelectedRow?: Dispatch<SetStateAction<RowSelectionState>>
    data: TData[];
    isLoading: boolean;
    pagination: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void
    },
}

export function LocalTablesDinnerTable<TData, TValue>({
                                                          data,
                                                          columns,
                                                          totalColumns,
                                                          selectedRow,
                                                          setSelectedRow,
                                                          isLoading,
                                                          pagination
                                                      }: TableComponentProps<TData, TValue>) {
    const table = useReactTable({
        data: data,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        state: {
            rowSelection: selectedRow
        },
        onRowSelectionChange: setSelectedRow,
        enableRowSelection: true,
    });
    return (
        <>
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
                        isLoading &&
                        (
                            <TableSkeletonColumns columns={totalColumns} rows={4}/>
                        )
                    }
                    {
                        data &&
                        (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    // className={row.getIsSelected() ? 'bg-black' : ''}
                                    // data-state={row.getIsSelected() && "selected"}
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
                </TableBody>
            </Table>
            {
                pagination.currentPage !== pagination.totalPages &&
                (
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
                )
            }
        </>
    );
}