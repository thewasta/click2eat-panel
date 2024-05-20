"use server"

import {requestWithSession} from "../request";

export async function productRetriever() {

}

export async function createProduct(formData: FormData) {
    const ENDPOINT = 'api/v1/products';
    const response = await requestWithSession(ENDPOINT, 'POST', formData);
    if (response.error) {
        throw new Error(response.errorDescription);
    }
}

export async function removeProduct(productId: number): Promise<any> {

    const ENDPOINT = 'products';
    const req = await requestWithSession(`api/v1/products/${productId}`, 'DELETE');

}

export async function editProduct(formData: FormData): Promise<any> {

    console.log(formData.get('name'))
    console.log(formData.get('price'))
    console.log(formData.get('description'))
    console.log(formData.get('category'))
}