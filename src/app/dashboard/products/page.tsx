"use client"

import {getProductColumns, Product} from "@/components/ui/colums";
import {ProductTable} from "@/components/products/product-table";
import {useCallback, useEffect, useMemo} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {removeProduct} from "@/_request/product/product.service";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {retriever} from "@/app/actions/product/product.service";
import {Tables} from "@/types/database/database";

export default function ProductsPage() {
    const router = useRouter();

    const queryClient = useQueryClient();

    const {data, error, isLoading} = useQuery<[]>({
        queryKey: ["products"],
        queryFn: async () => retriever(),
        refetchInterval: 120 * 1000, // Every minutes
        retry: false
    });

    useEffect(() => {
        if (error) {
            router.refresh();
        }
    }, [error]);

    const deleteMutation = useMutation({
        mutationFn: removeProduct,
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({queryKey: ['products']});
            if (data.error) {
                toast.error("No se ha podido eliminar el producto");
            } else {
                toast.success("Producto borrado correctamente");
            }
        },
        onError: () => {
            toast.error("No se ha podido eliminar el producto");
        }
    });

    const onDelete = useCallback((product: Tables<'product'>) => {
        deleteMutation.mutate(product.product_id);
    }, []);

    const columns = useMemo(() => getProductColumns({onDelete}), [])
    return (
        <div className={"col-span-3"}>
            <ProductTable data={data || []} columns={columns} isLoading={isLoading}/>
        </div>
    );
}