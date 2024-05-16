'use server'

import {request, RequestResponse} from "@/_request/request";
import {cookies} from "next/headers";
import * as jose from 'jose';
import {LoginAccountDto} from "@/types/auth/LoginAccount.types";
import {redirect} from "next/navigation";
import {RedirectType} from "next/dist/client/components/redirect";
import {RegisterAccount} from "@/lib/models/Account/RegisterAccount";
import {revalidatePath} from "next/cache";


const base64Secret = process.env.JWT_SECRET as string;
const secret = Buffer.from(base64Secret, 'base64');

export async function login(login: LoginAccountDto): Promise<any> {
    const ENDPOINT = 'auth/login';
    const cookieStore = cookies();
    let response = null;
    try {
        const tokenExpiration = new Date(0);
        response = await request(ENDPOINT, 'POST', {
            username: login.username,
            password: login.password
        });
        if (response.error) {
            return {
                error: true,
                errorDescription: response.errorDescription,
                message: null
            }
        }
        const decode = await jose.jwtVerify(response.message?.response.token, secret);
        if (decode && decode.payload && decode.payload.exp) {
            tokenExpiration.setUTCSeconds(decode.payload.exp);
            cookieStore.set(process.env.NEXT_PUBLIC_COOKIE_NAME, response.message?.response.token, {
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
            message: response.message?.response
        };
    } catch (error) {
        cookieStore.delete(process.env.NEXT_PUBLIC_COOKIE_NAME as string);
        return Promise.reject({
            error: true,
            //@ts-ignore
            errorDescription: error.description,
            message: null
        })
    }
}

export async function register(
    register: RegisterAccount,
    fcmToken: string): Promise<any> {
    const cookieStore = cookies();

    try {
        const ENDPOINT = 'auth/register';

        const {businessUuid} = await registerBusiness(
            register.businessName,
            register.document,
            register.address,
            register.postalCode,
            register.province,
            register.town,
            register.country,
        );
        const response = await request(ENDPOINT, 'POST', {
            "email": register.email,
            "lastname": register.lastName,
            "name": register.name,
            "username": register.username,
            "password": register.password,
            "fcmToken": fcmToken,
            "businessUuid": businessUuid
        });
        const tokenExpiration = new Date(0);
        if (response.error) {
            return {
                error: true,
                errorDescription: response.errorDescription,
                message: null
            }
        }
        const decode = await jose.jwtVerify(response.message?.response.token, secret);
        if (decode && decode.payload && decode.payload.exp) {
            tokenExpiration.setUTCSeconds(decode.payload.exp);
            cookieStore.set(process.env.NEXT_PUBLIC_COOKIE_NAME, response.message?.response.token, {
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
            errorDescription: error.description,
            message: null
        })
    }
}

export async function logout() {
    cookies().delete(`${process.env.NEXT_PUBLIC_COOKIE_NAME}`);
}
const registerBusiness = async (
    businessName: string | undefined,
    document: string | undefined,
    address: string | undefined,
    postalCode: number | undefined,
    province: string | undefined,
    town: string | undefined,
    country: string | undefined,
): Promise<any> => {
    const ENDPOINT = 'auth/business';
    try {
        const business = {
            businessName,
            document,
            address,
            postalCode,
            province,
            town,
            country,
        }
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