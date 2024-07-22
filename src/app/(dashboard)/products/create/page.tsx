'use client'
import ProductForm from "@/components/form/productForm";
import {SubmitHandler} from "react-hook-form";
import {CreateProductDTO} from "@/_lib/dto/productFormDto";

export default function CreateProductPage() {
    const submitHandler: SubmitHandler<CreateProductDTO> = async (values: CreateProductDTO) => {
        console.log('hola');
    }
    return (
        <ProductForm product={null} submitHandler={submitHandler} isEdit={false} categories={[]}/>
    );
}