import {useQuery} from "@tanstack/react-query";
import {Tables} from "@/types/database/database";
import {productById, productRetriever,} from "@/app/actions/dashboard/product.service";
import useDebounce from "@/_lib/_hooks/useDebounce";

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