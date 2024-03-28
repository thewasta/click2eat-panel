'use server'

import {request, RequestResponse} from "@/_actions/request";

export async function login(email: string, password: string): Promise<RequestResponse> {
    try {
        const ENDPOINT = 'auth/login';
        const response = await request(ENDPOINT, 'POST', {
            username: email,
            password
        });
        if (response.error) {
            return response;
        }
        return {
            error: false,
            errorDescription: null,
            message: response
        }
    } catch (error) {
        console.log(error)
        return {
            error: true,
            //@ts-ignore
            errorDescription: error.message,
            message: null
        }
    }
}