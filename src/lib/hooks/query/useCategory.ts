import {useQuery} from "@tanstack/react-query";
import {retrieveCategories} from "@/app/actions/dashboard/category.service";
import {retrieveCategoriesWithProducts} from "@/app/actions/dashboard/product.service";

export function useGetCategories() {
    const {data, error, status} = useQuery({
        queryKey: ["categories"],
        queryFn: async () => retrieveCategories(),
    });

    return {
        data,
        error,
        isLoading: status === "pending",
    }
}

export function useGetCategoriesWithProducts() {
    const {data, status, error} = useQuery({
        queryKey: ["category_products"],
        queryFn: async () => retrieveCategoriesWithProducts(),
    });

    return {
        data,
        isLoading: status === "pending",
        error
    }
}
