'use client'

import ProductForm from "@/components/form/product/productForm";
import {useQuery} from "@tanstack/react-query";
import {productById} from "@/app/actions/dashboard/product.service";
import {Tables} from "@/types/database/database";
import {retrieveCategories} from "@/app/actions/dashboard/category.service";
import {useEffect} from "react";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {useRouter} from "next/navigation";

type SubCategory = Tables<'sub_categories'>
type CategoryWithSubCategories = Tables<'categories'> & {
    sub_categories: SubCategory[]
}
export default function EditProductPage({params}: { params: { id: string } }) {

    const {data, error, isLoading,} = useQuery<Tables<'products'>>({
        queryKey: ["products", params.id],
        queryFn: async () => productById(params.id),
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

    const router = useRouter();

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                router.back();
            }, 3000);
        }
    }, [error, router]);
    if (error) {
        return (
            <Alert variant="destructive" className={'w-full md:w-1/3'}>
                <AlertDescription>
                    El producto no existe o ha sido eliminado.
                    Redirigiendo en 3 segundos...
                </AlertDescription>
            </Alert>
        );
    }
    return (
        <>
            {
                data &&
                <ProductForm product={data}
                             categories={categories || []}
                             isLoading={categoriesLoading}
                             isProductLoading={isLoading}/>
            }
        </>

    )
}