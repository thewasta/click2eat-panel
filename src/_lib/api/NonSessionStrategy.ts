import {RequestStrategy} from "@/_lib/api/RequestStrategyContract";

export interface RequestResponse {

}
export class NonSessionStrategy implements RequestStrategy {
    async request(endpoint: string, method: string, body?: any): Promise<RequestResponse> {
        const headers = {
            'Content-Type': 'application/json',
        };

        const response = await fetch(endpoint, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        return response.json();
    }
}