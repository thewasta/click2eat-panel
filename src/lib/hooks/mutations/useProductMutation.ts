import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createProduct, editProduct, removeProduct} from "@/app/actions/dashboard/product.service";
import {Tables} from "@/types/database/database";
import {toast} from "sonner";
import {UseFormReturn} from "react-hook-form";
import {Dispatch, SetStateAction} from "react";
import {formDateFromUtc} from "@/_lib/_hooks/formDateFromUtc";

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

export function useEditCreateProduct(
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