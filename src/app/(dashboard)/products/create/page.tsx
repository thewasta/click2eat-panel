'use client'
import ProductForm from "@/components/form/product/productForm";
import {useQuery} from "@tanstack/react-query";
import {retrieveCategories} from "@/app/actions/dashboard/category.service";
import {Tables} from "@/types/database/database";
import {useAllSubcategories} from "@/_lib/_hooks/useAllSubCategories";

type SubCategory = Tables<'sub_categories'>
type CategoryWithSubCategories = Tables<'categories'> & {
    sub_categories: SubCategory[]
}
export default function CreateProductPage() {
    const {data: categories, isLoading} = useQuery<CategoryWithSubCategories[]>({
        queryKey: ["categories"],
        queryFn: async () => retrieveCategories(),
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchInterval: false,
        refetchOnWindowFocus: false
    });
    const allSubcategories = useAllSubcategories(categories);

    return (
        <ProductForm product={null} categories={categories || []} subcategories={allSubcategories}
                     isLoading={isLoading}/>
    );
}