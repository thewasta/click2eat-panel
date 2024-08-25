'use client'
import ProductForm from "@/components/form/productForm";
import {SubmitHandler} from "react-hook-form";
import {CreateProductDTO} from "@/_lib/dto/productFormDto";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createProduct} from "@/_request/product/product.service";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

export default function CreateProductPage() {
    const queryClient = useQueryClient();

    const router = useRouter()

    const mutation = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["products"]
            }).then(_ => {
                toast.success('Producto creado correctamente')
            }).then(_ => {
                router.back();
            }).catch(_ => {
                toast.warning('Ha ocurrido al actualizar',{
                    description: 'Producto creado, pero ha ocurrido al error al redirigir'
                });
            });
        },
        onError: (error, variables, context) => {
            toast.error('No se ha podido crear',{
                description: `Motivo: ${error.message}`
            })
        }
    })
    const submitHandler: SubmitHandler<CreateProductDTO> = async (values: CreateProductDTO) => {
        console.log(values);
        // values.status = '1';
        // const formData = createFormData({...values, businessUuid: appContext.user()?.business.businessUuid});
        // mutation.mutate(formData);
    }
    return (
        <ProductForm product={null} submitHandler={submitHandler} categories={[]}/>
    );
}