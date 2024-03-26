'use server'

import {ErrorCodes} from "@/_lib/constants/errorCodes";

type Request_Type = 'GET' | 'POST' | 'DELETE';

export interface RequestResponse {
    error: boolean,
    errorDescription: string | null,
    message: [] | {} | null
}

export async function request(endpoint: string, method: Request_Type, body: {}): Promise<RequestResponse> {
    try {
        const response = await fetch(`${process.env.API_BASE_URL}${endpoint}` as string, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        if (response.status === 403) {
            await Promise.reject(ErrorCodes.WrongUserOrPassword);
        }
        if (response.status === 500) {
            await Promise.reject(ErrorCodes.ServerError)
        }
        const responseBody = await response.json();
        return {
            error: false,
            errorDescription: null,
            message: responseBody
        }
    } catch (error) {
        console.log(
            'AQUI ERROR'
        )
        error = Object.values(ErrorCodes).includes(error as string) ? error : 'Something went wrong';
        return {
            error: true,
            //@ts-ignore
            errorDescription: error,
            message: null
        }
    }
}