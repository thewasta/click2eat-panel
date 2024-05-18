"use server"

import { request, requestWithSession } from "../request";

export async function createProduct() {

}

export async function remove<T>(productId: number): Promise<any> {

    const ENDPOINT = 'products';
    const req = await requestWithSession(`api/v1/products/${productId}`, 'DELETE');

}