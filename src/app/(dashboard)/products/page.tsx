"use client"
import {getProductColumns} from "@/components/ui/colums";
import {ProductTable} from "@/components/products/product-table";
import {useCallback, useMemo} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {productRetriever, removeProduct} from "@/app/actions/dashboard/product.service";
import {toast} from "sonner";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Tables} from "@/types/database/database";

export default function ProductsPage() {

    const queryClient = useQueryClient();

    const {data, error, isLoading} = useQuery<Tables<'products'>[]>({
        queryKey: ["products"],
        queryFn: async () => productRetriever(),
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 3000,
        refetchOnMount: false,
        refetchIntervalInBackground: false
    });

    const deleteMutation = useMutation({
        mutationFn: removeProduct,
        onSuccess: () => {
            toast.error("Product eliminado correctamente");
        },
        onError: () => {
            toast.error("No se ha podido eliminar el producto");
        },
        onSettled: () => {
            queryClient.invalidateQueries({queryKey: ['products']});
        }
    });

    const onDelete = useCallback((product: Tables<'products'>) => {
        deleteMutation.mutate(product.id);
    }, []);

    const columns = useMemo(() => getProductColumns({onDelete}), []);
    return (
        <div className={'p-1'}>
            <ProductTable
                columns={columns}
                data={data || []}
                isLoading={isLoading}
                entityName={'Producto'}
                searchBy={'name'}
                buttonAction={(<Button asChild>
                    <Link href={'/products/create'}>
                        Crear producto
                    </Link>
                </Button>)}
            />
        </div>
    );
}