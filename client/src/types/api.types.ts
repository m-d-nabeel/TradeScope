export interface ApiResponse<T> {
    data: T;
    message: string;
    status: number;
}

export interface ErrorResponse {
    error: string;
    message: string;
    status: number;
}

export type ApiPromise<T> = Promise<ApiResponse<T>>;