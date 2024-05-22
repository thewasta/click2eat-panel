import {request} from "@/_request/request";
import { Product } from "./model/product";

interface IProductsResponse {
    error: boolean;
    errorDescription: null | string;
    message: Product[]
}
export async function retrieveProducts():Promise<IProductsResponse> {
    const ENDPOINT = 'auth/products';
    const response = await request(ENDPOINT, 'GET');
    if(response.message) {
        return {
            error: false,
            errorDescription: null,
            //@ts-ignore
            message: response.message
        }
    }
    return {
        error: false,
        errorDescription: null,
        //@ts-ignore
        message: response.message
    }
}