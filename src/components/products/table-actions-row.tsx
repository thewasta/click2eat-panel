import {Row} from "@tanstack/table-core";
import {Button} from "@/components/ui/button";
import {Pencil, Trash2} from "lucide-react";
import Link from "next/link";
import {Tables} from "@/types/database/database";

interface IProductTableActionProps<TData> {
    row: Row<TData>;
    onDelete: (value: TData) => void
}

const ProductTableActionsRows = <TData, >({row, onDelete}: IProductTableActionProps<TData>) => {
    return (
        <>
            <Link href={`/dashboard/menu/edit/${(row.original as Tables<'product'>).product_id}`}>
                <Button variant={"ghost"} size={"icon"}>
                    <Pencil />
                </Button>
            </Link>
            <Button variant={"ghost"} size={"icon"}>
                <Trash2 onClick={() => onDelete(row.original)}/>
            </Button>
        </>
    );
};

export default ProductTableActionsRows;