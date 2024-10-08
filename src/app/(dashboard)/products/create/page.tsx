'use client'

import ProductForm from "@/components/form/product/productForm";
import {useGetCategories} from "@/lib/hooks/query/useCategory";

export default function CreateProductPage() {
    const {data: categories, isLoading} = useGetCategories();

    return (
        <ProductForm
            product={null}
            categories={categories || []}
            isLoading={isLoading}
        />
    );
}