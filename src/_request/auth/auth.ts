'use server'

import {request, RequestResponse} from "@/_request/request";
import {cookies} from "next/headers";
import * as jose from 'jose';
import {RegisterBusinessData} from "@/components/auth/RegisterBusiness";
import {RegisterOwnerData} from "@/components/auth/RegisterOwner";

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
            return {
                error: true,
                errorDescription: response.errorDescription,
                message: null
            }
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
        console.log("aqui");
        return Promise.reject({
            error: true,
            //@ts-ignore
            errorDescription: error.description,
            message: null
        })
    }
}

export async function register(
    business: RegisterBusinessData,
    owner: RegisterOwnerData,
    fcmToken: string): Promise<RequestResponse> {
    try {
        const ENDPOINT = 'auth/register';
        const {businessUuid} = await registerBusiness(business);
        const response = await request(ENDPOINT, 'POST', {
            "email": owner.email,
            "lastname": owner.lastName,
            "name": owner.name,
            "username": owner.username,
            "password": owner.password,
            "fcmToken": fcmToken,
            "businessUuid": businessUuid
        });
        if (response.error) {
            return Promise.reject(response)
        }
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

const registerBusiness = async (business: RegisterBusinessData): Promise<any> => {
    const ENDPOINT = 'auth/business';
    try {
        const response = await request(ENDPOINT, 'POST', business);
        return response.message;
    } catch (e) {
        return Promise.reject({
            error: true,
            //@ts-ignore
            errorDescription: e.message,
        });
    }
}