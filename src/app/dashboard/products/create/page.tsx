'use client'

import {SubmitHandler, useForm} from "react-hook-form";
import {type CreateProductDTO, createProductSchema} from "@/app/dashboard/products/formValidation";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {create} from "@/app/actions/product/product.service";
import {toast} from "sonner";
import useFormData from "@/_lib/_hooks/useFormData";
import React, {ChangeEvent, useEffect} from "react";
import {Tables} from "@/types/database/database";
import {retrieve as categoryRetrieve} from "@/app/actions/category/category.service";
import ProductForm from "@/app/dashboard/products/components/productForm";

export default function CreateProductPage()  {
    const queryClient = useQueryClient();

    const {data: categories, error: categoriesError} = useQuery<Tables<'category'>[]>({
        queryKey: ["categories"],
        queryFn: async () => categoryRetrieve(),
        refetchInterval: 120 * 1000, // Every minutes
        retry: true,
    });

    useEffect(() => {
        if (categoriesError === null) {
            queryClient.invalidateQueries({
                queryKey: ["categories"]
            });
            queryClient.refetchQueries({
                queryKey: ["categories"],
            });
        }
    }, [categoriesError]);

    const createMutation = useMutation({
        mutationFn: create,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['products']
            });
            toast.success("Creado correctamente");
        },
        onError: (error, variables, context) => {
            toast.error("No ha sido posible crear el producto.", {
                description: error.message
            });
        },
    });

    const createFormData = useFormData<CreateProductDTO>();

    const onSubmit: SubmitHandler<CreateProductDTO> = async (values: CreateProductDTO) => {
        const formData = createFormData(values);
        createMutation.mutate(formData);
    }

    return (
        <>
            {
                categories ?
                    <ProductForm
                        submitHandler={onSubmit}
                        isEdit={false}
                        product={null}
                        categories={categories}
                    /> :
                    null
            }
        </>
    )
}