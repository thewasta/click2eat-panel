import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Tables} from "@/types/database/database";
import {productById, productRetriever, removeProduct} from "@/app/actions/dashboard/product.service";
import useDebounce from "@/_lib/_hooks/useDebounce";
import {toast} from "sonner";

interface UseProductsOptions {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    searchTerm?: string;
}

export function useGetProducts({
                                   page = 1,
                                   pageSize = 10,
                                   sortBy = 'created_at',
                                   sortOrder = 'desc',
                                   searchTerm = '',
                               }: UseProductsOptions) {
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
    const queryKey = ['products', page, pageSize, sortBy, sortOrder, debouncedSearchTerm];

    const {data, error, status} = useQuery({
        queryKey: queryKey,
        queryFn: async () => productRetriever({page, pageSize, sortBy, sortOrder, searchTerm: debouncedSearchTerm}),
    });
    const isLoading = status === "pending";
    return {
        data, error, isLoading: isLoading
    }
}

interface UseProductOptions {
    productId: string
}

export function useGetProduct({productId}: UseProductOptions) {
    const {data, error, status} = useQuery<Tables<'products'>>({
        queryKey: ["products", productId],
        queryFn: async () => productById(productId),
    });

    return {
        data,
        error,
        isLoading: status === "pending",
    }
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    const { mutate, mutateAsync, status, data } = useMutation({
        mutationFn: removeProduct,
        mutationKey: ['delete_product'],
        onMutate: async (deletedProductId) => {
            await queryClient.cancelQueries({ queryKey: ['products'] });

            const previousProducts = queryClient.getQueryData(['products']);

            queryClient.setQueryData<{
                products: Tables<'products'>[];
                totalCount: number;
            }>(['products'], old => {
                if (!old) return { products: [], totalCount: 0 };
                return {
                    products: old.products.filter(product => product.id !== deletedProductId),
                    totalCount: old.totalCount - 1,
                };
            });

            return { previousProducts };
        },
        onError: (err, deletedProductId, context) => {
            queryClient.setQueryData(['products'], context?.previousProducts);
            toast.error("No se ha podido eliminar el producto");
        },
        onSuccess: () => {
            console.log('ELMINADO CORRECTAMNTE');
            toast.success("Producto eliminado correctamente");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });

    return { mutate, mutateAsync, status, data };
}