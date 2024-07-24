'use server'

import {cookies} from "next/headers";
import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, Method} from "axios";

export interface SuccessResponse<T> {
    error: boolean;
    errorDescription: null | string;
    response: T | null;
}

export type Response<T> = SuccessResponse<T>;


const http: AxiosInstance = axios.create({
    baseURL: process.env.API_BASE_URL as string,
    headers: {
        'Content-Type': 'application/json',
    }
})
export const handleRequest = async <T>(method: Method, endpoint: string, options?: AxiosRequestConfig): Promise<Response<T>> => {
    try {
        const sessionCookie = cookies().get(`${process.env.NEXT_PUBLIC_COOKIE_NAME}`);
        const headers: AxiosRequestConfig["headers"] = {
            ...options?.headers
        }
        if (sessionCookie) {
            http.defaults.headers.common["Authorization"] = `Bearer ${sessionCookie.value}`;
        } else {
            http.defaults.headers.common["Authorization"] = null;
        }

        const response: AxiosResponse<Response<T>> = await http({
            method,
            url: endpoint,
            ...headers,
            ...options
        });
        return response.data;
    } catch (e) {
        console.log(e);
        if (e instanceof AxiosError) {
            return {
                error: true,
                errorDescription: e.response?.data.errorDescription,
                response: null
            }
        }
        return {
            error: true,
            errorDescription: 'Server error',
            response: null
        };
    }
}
