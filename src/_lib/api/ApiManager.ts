import {RequestStrategy} from "@/_lib/api/RequestStrategyContract";
import {RequireSessionStrategy} from "@/_lib/api/RequireSessionStrategy";
import {NonSessionStrategy} from "@/_lib/api/NonSessionStrategy";

class ApiManager {

    private readonly strategy: RequestStrategy;

    constructor(strategy: RequestStrategy) {
        this.strategy = strategy;
    }

    get(endpoint: string, body: {}): Promise<any> {
        return this.strategy.request(endpoint, 'GET');
    }

    post(endpoint: string, body?: {}, headers?: HeadersInit): Promise<any> {
        return this.strategy.request(endpoint, 'POST', body, headers);
    }

    put(endpoint: string, body?: {}): Promise<any> {
        return this.strategy.request(endpoint, 'PUT', body);
    }

    delete(endpoint: string, body: {}): Promise<any> {
        return this.strategy.request(endpoint, 'DELETE');
    }
}

export const requireSession = new ApiManager(new RequireSessionStrategy());

export const nonSession = new ApiManager(new NonSessionStrategy());