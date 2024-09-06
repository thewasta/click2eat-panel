'use client'

import {SubmitHandler} from "react-hook-form";
import ProductForm from "@/components/form/productForm";
import {CreateProductFormSchema} from "@/_lib/dto/productFormDto";
import axios from "axios";
import {Product} from "@/_request/product/model/product";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {productRetriever} from "@/_request/product/product.service";


export default function EditProductPage({params}: { params: { id: string } }) {

    const {data, error, isLoading} = useQuery<{ error: boolean, message: Product[] }>({
        queryKey: ["products"],
        queryFn: async () => productRetriever(),
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchIntervalInBackground: false
    });
    const [product, setProduct] = useState<Product|null>();

    useEffect(() => {
        if (!isLoading && data) {
            // @ts-ignore
            const productFound = data.message.response.find(product => product.id.toString() === params.id.toString());
            setProduct(productFound)
        }
    }, [isLoading, data]);

    const submitHandler: SubmitHandler<CreateProductFormSchema> = async (values: CreateProductFormSchema) => {
        console.log({values});
    };

    return (
        <>
            {
                product &&
                <ProductForm product={product} submitHandler={submitHandler} categories={[]}/>
            }
        </>

    )
}