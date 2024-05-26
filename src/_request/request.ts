'use server'

import {ErrorCodes} from "@/_lib/constants/errorCodes";
import {cookies} from "next/headers";
import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, Method} from "axios";

type Request_Type = 'GET' | 'POST' | 'DELETE';


export interface RequestResponse {
    error: boolean,
    errorDescription: string | null,
    message: {
        response: any
    } | null
}

class RequestError extends Error {
    public response: any;
    public errorCode: string;

    constructor(message: string, errorCode: string, response: any) {
        super(message);
        this.errorCode = errorCode;
        this.response = response;
    }
}

class SessionNotFound extends Error {
    public errorCode: number;

    constructor() {
        super('Session not found');
        this.errorCode = 403;
    }
}

export async function requestWithSession(endpoint: string, method: Request_Type, body?: BodyInit, nextOptions?: NextFetchRequestConfig) {
    try {
        const cookieStore = cookies();
        const sessionToken = cookieStore.get(`${process.env.NEXT_PUBLIC_COOKIE_NAME}`);
        if (null === sessionToken || !sessionToken) {
            throw new SessionNotFound();
        }
        const request = await fetch(`${process.env.API_BASE_URL}${endpoint}` as string, {
            method: method,
            headers: {
                'Authorization': `Bearer ${sessionToken.value}`
            },
            body: body,
            ...(nextOptions && {next: nextOptions})
        });

        if (403 === request.status) {
            throw new SessionNotFound();
        }

        if (500 === request.status) {
            let errorResponse = await request.json();
            throw new RequestError(ErrorCodes.ServerError, ErrorCodes.ServerError, errorResponse);
        }
        if (request.status === 204) {
            return {
                error: false,
                errorDescription: null,
                message: null
            }
        }
        const response = await request.json();
        return {
            error: false,
            errorDescription: null,
            message: response
        }
    } catch (error) {
        if (error instanceof RequestError) {
            return {
                error: true,
                errorDescription: error.response.description,
                message: null
            }

        } else {
            error = Object.values(ErrorCodes).includes(error as string) ? error : 'Something went wrong';
            return {
                error: true,
                //@ts-ignore
                errorDescription: error,
                message: null
            }
        }
    }
}

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

        const response: AxiosResponse<Response<T>> = await http({
            method,
            url: endpoint,
            ...(sessionCookie && {headers: {Authorization: `Bearer ${sessionCookie.value}`}}),
            ...options
        });
        return response.data;
    } catch (e) {
        if (e instanceof AxiosError) {
            return {
                error: true,
                errorDescription: e.response?.data.message,
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
