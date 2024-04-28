'use client'

import {ColumnDef} from "@tanstack/react-table";
import {FaSort} from "react-icons/fa";
import {revalidateContent} from "@/_request/revalidateContent";

export type Product = {
    id: string,
    name: string,
    price: number,
    category: string,
    status: string
};

export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        id: 'name',
        accessorKey: 'name',
        header: 'Nombre',
    },
    {
        accessorKey: 'price',
        header: ({ column }) => {
            return (
                <button
                    className={"flex"}
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <FaSort />
                </button>
            )
        },
    },
    {
        accessorKey: 'category',
        header: 'Categoría',
    },
    {
        accessorKey: 'status',
        header: 'Estado',
        cell: (cell) => {
            return cell.getValue() === 1 ? 'Activo' : 'Inactivo'
        }
    },
    {
        id: 'actions',
        cell: (_) => {
            return (
                <div className="dropdown dropdown-left dropdown-end md:dropdown-bottom">
                    <div tabIndex={0} role="button" className={"p-3"}>...</div>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-background rounded-box w-52">
                        <li className={"text-black"} onClick={() => revalidateContent('/dashboard/home/menu')}><a>Editar</a></li>
                        <li className={"text-black"}><a>Eliminar</a></li>
                    </ul>
                </div>
            )
        }
    }
];