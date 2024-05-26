"use server"

import {handleRequest, requestWithSession} from "../request";

export async function productRetriever(): Promise<any> {
    const ENDPOINT = 'auth/products';
    try {
        const response = await handleRequest('GET', ENDPOINT);
        return {
            error: false,
            errorDescription: null,
            //todo API DEBE DEVOLVER EL MISMO RESPUESTA QUE EL RESTO, ESTÁ DEVOLVIENDO ARRAY
            //@ts-ignore
            message: response
        }
    } catch (e) {
        return {
            error: true,
            errorDescription: 'Unhandled error',
            message: null
        }
    }
}

export async function createProduct(formData: FormData) {
    const ENDPOINT = 'api/v1/products';
    const response = await requestWithSession(ENDPOINT, 'POST', formData);
    if (response.error) {
        throw new Error(response.errorDescription);
    }
}

export async function removeProduct(productId: number): Promise<any> {
    const ENDPOINT = `api/v1/products/${productId}`;
    const req = await handleRequest('DELETE', ENDPOINT);
    if (req.error) {
        return {
            error: true,
            errorDescription: "Example",
            message: null
        }
    }

}

export async function editProduct(formData: FormData): Promise<any> {

    console.log(formData.get('name'))
    console.log(formData.get('price'))
    console.log(formData.get('description'))
    console.log(formData.get('category'))
}