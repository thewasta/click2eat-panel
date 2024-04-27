import {request} from "@/_request/request";

export async function retrieveProducts() {
    const ENDPOINT = 'auth/products';
    const response = await request(ENDPOINT, 'GET',{},{
        revalidate: 1800
    });
    return {
        error: false,
        errorDescription: null,
        message: response.message
    }
}