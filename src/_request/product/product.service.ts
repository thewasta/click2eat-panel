"use server"

import {requestWithSession} from "../request";

export async function productRetriever() {

}

export async function createProduct(formData: FormData) {

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