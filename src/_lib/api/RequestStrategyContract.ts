export type Request_Type = 'GET' | 'POST' | 'DELETE' | 'PUT';

export interface RequestStrategy {
    request(endpoint: string, method: Request_Type, body?: {}, headers?: HeadersInit): Promise<any>;
}