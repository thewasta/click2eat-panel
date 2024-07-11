"use server"

import {handleRequest} from "../request";
import {createClient} from "@/lib/supabase/server";

export async function productRetriever(): Promise<any> {
    const supabase = createClient();
    const {data, error} = await supabase.from('product').select('*')

    if (error) throw new Error(error.message);
    return data;
}

export async function createProduct(formData: FormData) {
    const ENDPOINT = 'api/v1/products';
    const response = await handleRequest('POST', ENDPOINT, {
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    if (response.error) {
        throw new Error(response.errorDescription || 'Error de servidor');
    }
}

export async function removeProduct(productId: string): Promise<any> {
    const ENDPOINT = `api/v1/products/${productId}`;
    const req = await handleRequest('DELETE', ENDPOINT);
    if (req.error) {
        return {
            error: true,
            errorDescription: "Example",
            message: null
        }
    }

    return {
        error: false,
        errorDescription: null,
        message: null
    }
}

export async function editProduct(formData: FormData): Promise<any> {
}