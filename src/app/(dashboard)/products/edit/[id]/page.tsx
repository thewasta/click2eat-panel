'use client'

import ProductForm from "@/components/form/product/productForm";
import {useQuery} from "@tanstack/react-query";
import {editProduct} from "@/app/actions/dashboard/product.service";
import {Tables} from "@/types/database/database";


export default function EditProductPage({params}: { params: { id: string } }) {

    const {data, error, isLoading} = useQuery<Tables<'products'>>({
        queryKey: ["products"],
        queryFn: async () => editProduct(params.id),
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchIntervalInBackground: false
    });
    const {data: categories, isLoading: categoriesLoading} = useQuery<CategoryWithSubCategories[]>({
        queryKey: ["categories"],
        queryFn: async () => retrieveCategories(),
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchInterval: false,
        refetchOnWindowFocus: false
    });

    return (
        <>
            {
                data &&
                <ProductForm product={data} categories={categories || []} isLoading={isLoading}/>
            }
        </>

    )
}