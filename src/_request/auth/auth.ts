'use server'

import {handleRequest} from "@/_request/request";
import {cookies} from "next/headers";
import * as jose from 'jose';
import {RegisterAccount} from "@/lib/models/Account/RegisterAccount";
import {LoginResponse} from "@/_request/auth/types/LoginResponse";
import {setCookie} from "cookies-next";
import {LoginFormSchema} from "@/types/validation/loginFormValidation";

const base64Secret = process.env.JWT_SECRET as string;
const secret = Buffer.from(base64Secret, 'base64');
const cookieStore = cookies();

export async function login(login: LoginFormSchema): Promise<any> {
    const ENDPOINT = 'auth/login';
    try {
        const tokenExpiration = new Date(0);
        const request = await handleRequest<LoginResponse>('POST', ENDPOINT, {
            data: {
                username: login.username,
                password: login.password
            }
        });

        if (request.error) {
            throw new Error(request.errorDescription || 'Fallo de autenticación');
        }

        if (request.response) {
            await createSessionCookie(request.response?.token, tokenExpiration);
            return {
                error: false,
                errorDescription: null,
                message: request.response
            };
        }
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

async function createSessionCookie(token: string, tokenExpiration: Date) {
    const decode = await jose.jwtVerify(token, secret);
    if (decode && decode.payload && decode.payload.exp) {
        tokenExpiration.setUTCSeconds(decode.payload.exp);
        cookieStore.set(process.env.NEXT_PUBLIC_COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            expires: tokenExpiration,
            path: '/'
        });
        setCookie(
            process.env.NEXT_PUBLIC_COOKIE_NAME,
            token,
            {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                expires: tokenExpiration,
                path: '/'
            }
        )
    }
}

export async function register(
    register: RegisterAccount): Promise<any> {
    const ENDPOINT = 'auth/register';

    const responseBusiness = await registerBusiness(
        register.businessName,
        register.document,
        register.address,
        register.postalCode,
        register.province,
        register.town,
        register.country,
    );

    if (responseBusiness.error || responseBusiness.response.businessUuid === undefined) {
        throw new Error(responseBusiness.errorDescription);
    }
    const response = await handleRequest<LoginResponse>('POST', ENDPOINT, {
        data: {
            "email": register.email,
            "lastname": register.lastName,
            "name": register.name,
            "username": register.username,
            "password": register.password,
            "fcmToken": register.fcmToken,
            "businessUuid": responseBusiness.response.businessUuid
        }
    });
    const tokenExpiration = new Date(0);
    if (response.error) {
        throw new Error(response.errorDescription as string);
    }
    if (response.response) {
        await createSessionCookie(response.response.token, tokenExpiration);
        return {
            error: false,
            errorDescription: null,
            message: response.response
        }
    }
}

export async function logout() {
    cookieStore.set(`${process.env.NEXT_PUBLIC_COOKIE_NAME}`, "", {expires: new Date(0)});
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
        return await handleRequest('POST', ENDPOINT, {
            data: {
                businessName,
                document,
                address,
                postalCode,
                province,
                town,
                country,
            }
        });
    } catch (e) {
        return Promise.reject({
            error: true,
            //@ts-ignore
            errorDescription: e.message,
        });
    }
}