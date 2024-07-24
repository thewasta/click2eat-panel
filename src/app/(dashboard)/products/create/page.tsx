'use client'
import ProductForm from "@/components/form/productForm";
import {SubmitHandler} from "react-hook-form";
import {CreateProductDTO} from "@/_lib/dto/productFormDto";
import {useMutation} from "@tanstack/react-query";
import {createProduct} from "@/_request/product/product.service";
import {toast} from "sonner";
import useFormData from "@/_lib/_hooks/useFormData";
import {useUserAppContext} from "@/lib/context/auth/user-context";
import {useRouter} from "next/navigation";

export default function CreateProductPage() {
    const router = useRouter()
    const createFormData = useFormData<CreateProductDTO>();
    const appContext = useUserAppContext();
    const mutation = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            toast.success('Producto creado correctamente');
            router.back();
        },
        onError: (error, variables, context) => {
            toast.error('No se ha podido crear',{
                description: `Motivo: ${error.message}`
            })
        }
    })
    const submitHandler: SubmitHandler<CreateProductDTO> = async (values: CreateProductDTO) => {
        values.status = '1';
        const formData = createFormData({...values, businessUuid: appContext.user()?.business.businessUuid});
        mutation.mutate(formData);
    }
    return (
        <ProductForm product={null} submitHandler={submitHandler} isEdit={false} categories={[]}/>
    );
}