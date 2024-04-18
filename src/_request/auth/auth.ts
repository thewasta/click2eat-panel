'use server'

import {request, RequestResponse} from "@/_request/request";
import {cookies} from "next/headers";
import * as jose from 'jose';

const base64Secret = process.env.JWT_SECRET as string;
const secret = Buffer.from(base64Secret, 'base64');

export async function login(email: string, password: string): Promise<RequestResponse> {
    try {
        const ENDPOINT = 'auth/login';
        const cookieStore = cookies();
        const tokenExpiration = new Date(0);
        const response = await request(ENDPOINT, 'POST', {
            username: email,
            password
        });
        if (response.error) {
            return Promise.reject(response)
        }
        //@ts-ignore
        const decode = await jose.jwtVerify(response.message?.token, secret);
        if (decode && decode.payload && decode.payload.exp) {
            tokenExpiration.setUTCSeconds(decode.payload.exp);
            //@ts-ignore
            cookieStore.set(process.env.NEXT_PUBLIC_COOKIE_NAME, response.message.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                expires: tokenExpiration,
                path: '/'
            });
        }

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