// Define an interface for request configuration
interface RequestConfig {
    baseURL?: string;
    headers?: Record<string, string>;
}

// Define an interface for the response structure
interface ResponseData<T = any> {
    status: number;
    statusText: string;
    data: T;
}

// Define an interface for HTTP client methods
interface HttpClient {
    get<T>(url: string, config?: RequestConfig): Promise<ResponseData<T>>;
    post<T>(url: string, body: any, config?: RequestConfig): Promise<ResponseData<T>>;
}

// Create a class to wrap fetch calls
export class Request implements HttpClient {
    private defaultConfig: RequestConfig;

    constructor(defaultConfig: RequestConfig = {}) {
        this.defaultConfig = {
            baseURL: '',
            headers: {
                'Content-Type': 'application/json',
            },
            ...defaultConfig,
        };
    }

    // Handle the response, checking status and parsing JSON if available
    private async handleResponse<T>(response: Response): Promise<ResponseData<T>> {
        const contentType = response.headers.get('Content-Type');
        const isJSON = contentType && contentType.includes('application/json');
        const data = isJSON ? await response.json() : await response.text();
        if (!response.ok) {
            throw {
                status: response.status,
                statusText: response.statusText,
                data,
            };
        }

        return {
            status: response.status,
            statusText: response.statusText,
            data,
        };
    }

    // GET request method
    async get<T>(url: string, config: RequestConfig = {}): Promise<ResponseData<T>> {
        const mergedConfig = { ...this.defaultConfig, ...config };
        const fullUrl = `${mergedConfig.baseURL || ''}${url}`;

        try {
            const response = await fetch(fullUrl, {
                method: 'GET',
                headers: mergedConfig.headers,
            });
            return this.handleResponse<T>(response);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    // POST request method
    async post<T>(url: string, body: any, config: RequestConfig = {}): Promise<ResponseData<T>> {
        const mergedConfig = { ...this.defaultConfig, ...config };
        const fullUrl = `${mergedConfig.baseURL || ''}${url}`;

        try {
            const response = await fetch(fullUrl, {
                method: 'POST',
                headers: mergedConfig.headers,
                body: JSON.stringify(body),
            });
            return this.handleResponse<T>(response);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export default new Request();