import {ColumnDef} from "@tanstack/react-table";
import {FaSort, FaSortDown, FaSortUp} from "react-icons/fa";
import ProductTableActionsRows from "@/components/products/table-actions-row";
import {Badge} from "@/components/ui/badge";
import {Tables} from "@/types/database/database";
import Image from "next/image";

interface ProductsColumnsProps {
    onDelete: (product: Tables<'products'>) => void;
    onSort: (column: string) => void;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

export const getProductColumns = ({
                                      onDelete,
                                      onSort,
                                      sortBy,
                                      sortOrder
                                  }: ProductsColumnsProps): ColumnDef<Tables<'products'>>[] => [
    {
        accessorKey: 'id',
        header: () => {
            return (
                <button
                    className={"flex items-center gap-1"}
                >
                    <span>Nº</span>
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
            //@ts-ignore
            if (imageFilePath[0] === undefined) {
                return <Image width={100} height={100} src={'https://placehold.co/250x250'} alt={'image product'}/>
            }
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
        header: () => (
            <button
                className="flex items-center gap-1"
                onClick={() => onSort('name')}
            >
                <span>Nombre</span>
                {sortBy === 'name' ? (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
            </button>
        ),
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
        header: () => (
            <button
                className="flex items-center gap-1"
                onClick={() => onSort('price')}
            >
                <span>Precio</span>
                {sortBy === 'price' ? (sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />) : <FaSort />}
            </button>
        ),
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