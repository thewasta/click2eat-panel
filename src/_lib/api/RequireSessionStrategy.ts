import {RequestStrategy} from "@/_lib/api/RequestStrategyContract";
import {cookies} from "next/headers";

export class RequireSessionStrategy implements RequestStrategy {
    async request(endpoint: string, method: string, body?: any, headers?: HeadersInit): Promise<any> {
        const cookieStore = cookies();
        const token = cookieStore.get(process.env.NEXT_PUBLIC_COOKIE_NAME as string)
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };

        const response = await fetch(endpoint, {
            method,
            headers: {...defaultHeaders, ...headers},
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        return response.json();
    }
}
