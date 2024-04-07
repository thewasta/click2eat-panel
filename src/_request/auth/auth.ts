'use server'

import {request, RequestResponse} from "@/_request/request";
import {cookies} from "next/headers";

export async function login(email: string, password: string): Promise<RequestResponse> {
    try {
        const ENDPOINT = 'auth/login';
        const cookieStore = cookies();
        const response = await request(ENDPOINT, 'POST', {
            username: email,
            password
        });
        if (response.error) {
            return Promise.reject(response)
        }
        //@ts-ignore
        cookieStore.set(process.env.NEXT_PUBLIC_COOKIE_NAME as string, response.message.token)
        return {
            error: false,
            errorDescription: null,
            message: response.message
        }
    } catch (error) {
        return Promise.reject({
            error: true,
            //@ts-ignore
            errorDescription: error.message,
            message: null
        })
    }
}