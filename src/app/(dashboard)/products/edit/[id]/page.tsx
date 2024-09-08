'use client'

import {SubmitHandler} from "react-hook-form";
import ProductForm from "@/components/form/product/productForm";
import {CreateProductDTO} from "@/_lib/dto/productFormDto";
import axios from "axios";
import {Product} from "@/_request/product/model/product";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {editProduct, productRetriever} from "@/app/actions/dashboard/product.service";
import {Tables} from "@/types/database/database";


export default function EditProductPage({params}: { params: { id: string } }) {

    const {data, error, isLoading} = useQuery<Tables<'products'>>({
        queryKey: ["products"],
        queryFn: async () => editProduct(params.id),
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

    const submitHandler: SubmitHandler<CreateProductDTO> = async (values: CreateProductDTO) => {
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