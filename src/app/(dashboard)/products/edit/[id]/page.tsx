import ProductForm from "@/components/form/product/productForm";
import {productById} from "@/app/actions/dashboard/product.service";
import {retrieveCategories} from "@/app/actions/dashboard/category.service";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";

export default function EditProductPage({params}: { params: { id: string } }) {
    const queryClient = new QueryClient();
    queryClient.prefetchQuery({
        queryKey: ["products", params.id],
        queryFn: async () => productById(params.id)
    });
    queryClient.prefetchQuery({
        queryKey: ["categories"],
        queryFn: async () => retrieveCategories()
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductForm id={params.id}/>
        </HydrationBoundary>
    )
}