import {handleRequest} from "@/_request/request";
import {Product} from "./model/product";

interface IProductsResponse {
    error: boolean;
    errorDescription: null | string;
    message: Product[] | null
}
export async function retrieveProducts():Promise<IProductsResponse> {
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
    }catch (e) {
        return {
            error: true,
            errorDescription: 'Unhandled error',
            message: null
        }
    }
}