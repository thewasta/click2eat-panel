'use server'

import {ErrorCodes} from "@/_lib/constants/errorCodes";

type Request_Type = 'GET' | 'POST' | 'DELETE';

export interface RequestResponse {
    error: boolean,
    errorDescription: string | null,
    message: [] | {} | null
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

export async function request(endpoint: string, method: Request_Type, body?: {}): Promise<RequestResponse> {
    try {
        const response = await fetch(`${process.env.API_BASE_URL}${endpoint}` as string, {
            credentials: 'include',
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            ...(method !== 'GET' && {body: JSON.stringify(body)})
        });

        if (response.status === 403) {
            let errorResponse = await response.json();
            throw new RequestError(ErrorCodes.WrongUserOrPassword, ErrorCodes.WrongUserOrPassword, errorResponse);
        }
        if (response.status === 500) {
            let errorResponse = await response.json();
            throw new RequestError(ErrorCodes.ServerError, ErrorCodes.ServerError, errorResponse);
        }
        const responseBody = await response.json();
        return {
            error: false,
            errorDescription: null,
            message: responseBody
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