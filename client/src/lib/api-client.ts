const API_BASE_URL = import.meta.env.VITE_API_URL;

type ApiMethodsTypes = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type ApiOptions = Omit<RequestInit, 'body'> & { auth?: string };
type ApiRequestConfig = ApiOptions & { params?: Record<string, unknown>, data?: unknown };

class Api {
  public baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private buildUrl(endpoint: string, queryParams?: Record<string, unknown>) {
    const url = new URL(endpoint, this.baseUrl);
    if (!queryParams) return url.toString();

    Object.entries(queryParams).forEach(([key, value]) => {
      if (key !== '' && value !== '') url.searchParams.append(key, String(value));
    });

    return url.toString();
  }

  private async request<T>(method: ApiMethodsTypes, endpoint: string, config: ApiRequestConfig = {}): Promise<T> {
    const { params, data, auth, headers, ...rest } = config;
    const url = this.buildUrl(endpoint, params);

    const reqHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers as Record<string, string>
    };

    if (auth) reqHeaders['Authorization'] = `Bearer ${auth}`;

    const reqOptions: RequestInit = {
      method,
      headers: reqHeaders,
      ...rest
    };

    if (data !== undefined) {
      if (data instanceof FormData) {
        reqOptions.body = data;
        delete reqHeaders['Content-Type'];
      }
      else reqOptions.body = JSON.stringify(data);
    }

    const response = await fetch(url, reqOptions);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    return response.json();
  }

  async get<T>(endpoint: string, config?: ApiRequestConfig): Promise<T> {
    return await this.request<T>('GET', endpoint, config);
  }

  async post<T>(endpoint: string, data?: unknown, config?: ApiRequestConfig): Promise<T> {
    return await this.request<T>('POST', endpoint, { ...config, data });
  }

  async put<T>(endpoint: string, data?: unknown, config?: ApiRequestConfig): Promise<T> {
    return await this.request<T>('PUT', endpoint, { ...config, data });
  }

  async delete<T>(endpoint: string, config?: ApiRequestConfig): Promise<T> {
    return await this.request<T>('DELETE', endpoint, config);
  }
}

export const api = new Api(API_BASE_URL);
