import {ColumnDef} from "@tanstack/react-table";
import {FaSort} from "react-icons/fa";
import ProductTableActionsRows from "@/components/products/table-actions-row";
import {Product} from "@/_lib/dto/productDto";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Pencil, Trash2} from "lucide-react";
import {Tables} from "@/types/database/database";
import Image from "next/image";

interface ProductsColumnsProps {
    onDelete: (bankAccount: any) => void;
}

export const getProductColumns = ({onDelete}: ProductsColumnsProps): ColumnDef<Tables<'products'>>[] => [
    {
        accessorKey: 'id',
        header: ({column}) => {
            return (
                <button
                    className={"flex items-center gap-1"}
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <span>Nº</span>
                    <FaSort/>
                </button>
            )
        },
        cell: ({row}) => {
            return parseInt(row.id) + 1;
        }
    },
    {
        accessorKey: 'imageUrls',
        header: 'Imagen',
        cell: (cell) => {
            const imageFilePath = cell.getValue();
            return (
                imageFilePath &&
                    //@ts-ignore
                <Image width={100} height={100} className={"object-cover h-16 w-12"} src={imageFilePath[0]}
                     alt={"image product"} unoptimized/>
            );
        }
    },
    {
        id: 'name',
        accessorKey: 'name',
        header: 'Nombre',
    },
    {
        accessorKey: 'status',
        header: 'Estado',
        cell: (cell) => {
            type ProductStatus = "DRAFT" | "PUBLISHED" | "DISCONTINUED";
            const status = cell.getValue() as ProductStatus;
            if (status === 'DRAFT') {
                return <Badge variant={'secondary'}>Borrador</Badge>;
            } else if (status === 'PUBLISHED') {
                return <Badge>Publicado</Badge>;
            } else {
                return <Badge variant={"destructive"}>No activo</Badge>;
            }
        }
    },
    {
        accessorKey: 'price',
        header: ({column}) => {
            return (
                <button
                    className={"flex items-center gap-1"}
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <span>Precio</span>
                    <FaSort/>
                </button>
            )
        },
    },
    {
        accessorKey: 'categories.name',
        header: 'Categoría',
    },
    {
        id: 'actions',
        cell: ({row}) => <ProductTableActionsRows row={row} onDelete={onDelete}/>
    }
];