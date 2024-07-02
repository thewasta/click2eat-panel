'use server'

import {handleRequest} from "@/_request/request";
import {cookies} from "next/headers";
import * as jose from 'jose';
import {LoginAccountDto} from "@/types/auth/LoginAccount.types";
import {RegisterAccount} from "@/lib/models/Account/RegisterAccount";
import {LoginResponse} from "@/_request/auth/types/LoginResponse";
import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";

const base64Secret = process.env.JWT_SECRET as string;
const secret = Buffer.from(base64Secret, 'base64');
const cookieStore = cookies();

export async function withGoogleLogin() {
    const supabase = createClient()

    const {data, error} = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: process.env.NEXT_PUBLIC_AUTH0_CALLBACK_URL,
        },
    });
    if (data.url) {
        redirect(data.url);
    }
}

export async function withPasswordLogin(formData: LoginAccountDto) {
    const supabase = createClient();

    const data = {
        email: formData.username,
        password: formData.password
    }
    const {error} = await supabase.auth.signInWithPassword(data)
    if (error) {
        console.error(error.cause, error.name, error.message)
    }
    redirect('/');
}

export async function withPasswordRegister(formData: LoginAccountDto) {
    const supabase = createClient();

    const data = {
        email: formData.username,
        password: formData.password
    }

    const {error} = await supabase.auth.signUp(data);
    if (error) {
        console.log(error)
    }
    redirect('/');
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
    }
}

export async function register(
    register: RegisterAccount,
    fcmToken: string): Promise<any> {
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
        const response = await handleRequest<LoginResponse>('POST', ENDPOINT, {
            data: {
                "email": register.email,
                "lastname": register.lastName,
                "name": register.name,
                "username": register.username,
                "password": register.password,
                "fcmToken": fcmToken,
                "businessUuid": businessUuid
            }
        });
        const tokenExpiration = new Date(0);
        if (response.error) {
            return {
                error: true,
                errorDescription: response.errorDescription,
                message: null
            }
        }
        if (response.response) {
            await createSessionCookie(response.response.token, tokenExpiration);
            return {
                error: false,
                errorDescription: null,
                message: response
            }
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
    await createClient().auth.signOut();
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