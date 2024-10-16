import ProductForm from "@/components/form/product/productForm";
import {retrieveCategories} from "@/app/actions/dashboard/category.service";
import type {Metadata} from "next";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";

export const metadata: Metadata = {
    title: 'Crear producto',
};

export default async function CreateProductPage() {
    const queryClient = new QueryClient();

    queryClient.prefetchQuery({
        queryKey: ["categories"],
        queryFn: async () => retrieveCategories()
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductForm />
        </HydrationBoundary>
    );
}