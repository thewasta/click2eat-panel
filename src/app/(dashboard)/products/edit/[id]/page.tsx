'use client'

import ProductForm from "@/components/form/product/productForm";
import {useEffect} from "react";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {useRouter} from "next/navigation";
import {useGetProduct} from "@/lib/hooks/query/useProduct";
import {useGetCategories} from "@/lib/hooks/query/useCategory";

export default function EditProductPage({params}: { params: { id: string } }) {
    const {data, error, isLoading} = useGetProduct({productId: params.id});

    const {data: categories, isLoading: categoriesLoading} = useGetCategories();

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