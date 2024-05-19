"use client"
import {retrieveProducts} from "@/_request/product/productRetriever";
import {getProductColumns, Product} from "@/components/ui/colums";
import {ProductTable} from "@/components/products/product-table";
import {useCallback, useEffect, useMemo} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {removeProduct} from "@/_request/product/product.service";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

async function getProducts(): Promise<Product[]> {
    const response = await retrieveProducts();
    //@ts-ignore
    return response.message as Product[];
}

export default function ProductsPage() {
    const router = useRouter();

    const queryClient = useQueryClient();

    const {data, error, isLoading} = useQuery<Product[]>({
        queryKey: ["products"],
        queryFn: async () => getProducts(),
        refetchInterval: 120 * 1000, // Every minutes
        retry: false
    });

    useEffect(() => {
        if (error) {
            router.replace('/');
        }
    }, [error]);

    const deleteMutation = useMutation({
        mutationFn: removeProduct,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['products']});
            toast.success("Producto borrado correctamente");
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
            <ProductTable data={data || []} columns={columns} isLoading={isLoading}/>
        </div>
    );
}