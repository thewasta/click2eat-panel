import { ColumnDef } from "@tanstack/react-table";
import { FaSort } from "react-icons/fa";
import ProductTableActionsRows from "@/components/products/table-actions-row";
import {Tables} from "@/types/database/database";

export type Product = {
    businessUuid: string;
    id: string;
    name: string;
    price: number;
    category: string;
    status: string;
    image: string;
    description: string;
};


interface ProductsColumnsProps {
    onDelete: (bankAccount: any) => void;
}
export const getProductColumns = ({onDelete}:ProductsColumnsProps): ColumnDef<Product>[] => [
    {
        accessorKey: 'id',
        header: ({ column }) => {
            return (
                <button
                    className={"flex items-center gap-1"}
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <span>Nº</span>
                    <FaSort />
                </button>
            )
        },
        cell: ({row}) => {
            return parseInt(row.id) + 1;
        }
    },
    {
        accessorKey: 'images',
        header: 'Imagen',
        cell: ({cell,row}) => {
            const imageFilePath = cell.getValue<string[]>()[0] as string;
            return (
                <div className={'aspect-h-1 aspect-w-1 w-16'}>
                    <img className={"object-cover"}
                         src={`${process.env.NEXT_PUBLIC_BUCKET_STORAGE}${imageFilePath}`}
                         alt={"image product"}/>
                </div>
            )
        }
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
                    className={"flex items-center gap-1"}
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <span>Precio</span>
                    <FaSort />
                </button>
            )
        },
    },
    {
        accessorKey: 'category',
        header: 'Categoría',
        cell: ({cell,row}) => {
            const category = cell.getValue<Tables<'category'>>();
            return category.name
        }
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
        cell: ({row}) => <ProductTableActionsRows row={row} onDelete={onDelete}/>
    }
];