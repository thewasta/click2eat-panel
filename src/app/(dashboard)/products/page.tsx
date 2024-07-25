"use client"
import {getProductColumns} from "@/components/ui/colums";
import {ProductTable} from "@/components/products/product-table";
import {useCallback, useEffect, useMemo} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {productRetriever, removeProduct} from "@/_request/product/product.service";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {Product} from "@/_lib/dto/productDto";

export default function ProductsPage() {
    const router = useRouter();

    const queryClient = useQueryClient();

    const {data, error, isLoading} = useQuery<{ error: boolean, message: Product[] }>({
        queryKey: ["products"],
        queryFn: async () => productRetriever(),
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchIntervalInBackground: false
    });

    useEffect(() => {
        if (error) {
            router.replace('/');
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

    const onDelete = useCallback((product: Product) => {
        deleteMutation.mutate(parseInt(product.id));
    }, []);

    const columns = useMemo(() => getProductColumns({onDelete}), [])
    return (
        <div className={"col-span-3"}>
            {/*@ts-ignore*/}
            <ProductTable data={data?.message.response || []} columns={columns} isLoading={isLoading}/>
        </div>
    );
}