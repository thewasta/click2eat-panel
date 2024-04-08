'use server'

import {request, RequestResponse} from "@/_request/request";
import {cookies} from "next/headers";
// import {uuid4} from "@sentry/utils";

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

export async function register(email: string, ownerLastname: string, ownerName: string, ownerUsername: string, ownerPassword: string): Promise<RequestResponse> {
    try {
        const ENDPOINT = 'auth/register';
        // const uuid = uuid4();
        const response = await request(ENDPOINT, 'POST', {
            "email": email,
            "lastname": ownerLastname,
            "name": ownerName,
            "username": ownerUsername,
            "password": ownerPassword,
            "businessUuid": "uuid"
        })
        return {
            error: false,
            errorDescription: null,
            message: null
        }
    } catch (error) {
        return Promise.reject({
            error: true,
            //@ts-ignore
            errorDescription: error.description,
            message: null
        })
    }
}