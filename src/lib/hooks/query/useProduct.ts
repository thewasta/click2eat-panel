import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Tables} from "@/types/database/database";
import {
    createProduct,
    editProduct,
    productById,
    productRetriever,
    removeProduct
} from "@/app/actions/dashboard/product.service";
import useDebounce from "@/_lib/_hooks/useDebounce";
import {toast} from "sonner";
import {UseFormReturn} from "react-hook-form";
import {formDateFromUtc} from "@/_lib/_hooks/formDateFromUtc";
import {Dispatch, SetStateAction} from "react";

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

    const {mutate, mutateAsync, status, data} = useMutation({
        mutationFn: removeProduct,
        mutationKey: ['delete_product'],
        onMutate: async (deletedProductId) => {
            await queryClient.cancelQueries({queryKey: ['products']});

            const previousProducts = queryClient.getQueryData(['products']);

            queryClient.setQueryData<{
                products: Tables<'products'>[];
                totalCount: number;
            }>(['products'], old => {
                if (!old) return {products: [], totalCount: 0};
                return {
                    products: old.products.filter(product => product.id !== deletedProductId),
                    totalCount: old.totalCount - 1,
                };
            });

            return {previousProducts};
        },
        onError: (err, deletedProductId, context) => {
            queryClient.setQueryData(['products'], context?.previousProducts);
            toast.error("No se ha podido eliminar el producto");
        },
        onSuccess: () => {
            toast.success("Producto eliminado correctamente");
        },
        onSettled: () => {
            queryClient.invalidateQueries({queryKey: ['products']});
        },
    });

    return {mutate, mutateAsync, status, data};
}

export function useProductMutation(
    isEdit: boolean, form: UseFormReturn<any>, defaultValues: any, setFormKey: Dispatch<SetStateAction<number>>, setVariantGroups: Dispatch<SetStateAction<any[]>>) {
    const queryClient = useQueryClient();

    const {mutate, mutateAsync, status, data} = useMutation({
        mutationFn: isEdit ? editProduct : createProduct,
        mutationKey: [isEdit ? 'edit_product' : 'create_product'],
        onSuccess: (data) => {
            if (isEdit) {
                const localPublishDate = data.publish_date
                    ? formDateFromUtc(data.publish_date)
                    : undefined;
                form.reset({
                    subCategory: data.sub_category_id || undefined,
                    category: data.category_id,
                    description: data.description as string,
                    highlight: data.highlight,
                    productName: data.name,
                    price: data.price,
                    productId: data.id,
                    offerPrice: data.offer as number,
                    status: data.status,
                    publishDate: localPublishDate ? new Date(localPublishDate) : undefined,
                    variantGroups: []
                });
                toast.success('Producto editado correctamente');
            } else {
                form.reset(defaultValues);
                toast.success('Producto creado correctamente');
            }
        },
        onError: (error) => {
            toast.error('No se ha podido procesar el producto', {
                description: `Motivo: ${error.message}`
            });
        },
        onSettled: () => {
            setFormKey(prev => prev + 1);
            setVariantGroups([]);
            queryClient.invalidateQueries({queryKey: ['products'], refetchType: 'all'});
        }
    });

    return {mutate, mutateAsync, status, data};
}