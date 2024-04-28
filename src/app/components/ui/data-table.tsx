'use client'
import {
    ColumnDef, getCoreRowModel, getPaginationRowModel,
    SortingState, getSortedRowModel, ColumnFiltersState,
    getFilteredRowModel
} from "@tanstack/table-core";
import {flexRender, useReactTable} from "@tanstack/react-table";
import {useState} from "react";
import FormInputText from "@/app/components/form/FormInputText";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData, TValue>({columns, data}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const table = useReactTable({
        data,
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
        <div>
            <div className="flex items-center py-4">
                <FormInputText
                    name={"filter"}
                    inputType={"text"}
                    placeholder="Nombre producto..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                />
            </div>
            <table className={"table shadow-md bg-background"}>
                <thead className={"text-[#10162499]"}>
                {
                    table.getHeaderGroups().map(headerGroup => {
                        return (
                            <tr key={headerGroup.id}>
                                {
                                    headerGroup.headers.map(header => {
                                        return (
                                            <td key={header.id}>
                                                {
                                                    header.isPlaceholder
                                                        ? null
                                                        : flexRender(header.column.columnDef.header, header.getContext())
                                                }
                                            </td>
                                        )
                                    })
                                }
                            </tr>
                        )
                    })
                }
                </thead>
                <tbody>
                {
                    table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map(row => {
                            return (
                                <tr key={row.id} className={"hover hover:text-white hover:cursor-pointer"}>
                                    {
                                        row.getVisibleCells().map(cell => (
                                            <td key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))
                                    }
                                </tr>
                            )
                        })
                    ) : (
                        <tr>
                            <td colSpan={columns.length}>
                                No hay datos
                            </td>
                        </tr>
                    )
                }
                </tbody>
            </table>
            <div className={"join"}>
                <button
                    className={"btn join-item"}
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >Atrás
                </button>
                <button
                    className={"btn join-item"}
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >Siguiente
                </button>
            </div>
        </div>
    )
}