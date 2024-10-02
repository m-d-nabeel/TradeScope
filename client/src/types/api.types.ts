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
export type ApiErrorPromise = Promise<ErrorResponse>;

export type AuthStatusApiResponse = {
  status: string;
  user: {
    email: string;
    name: string;
    user_id: string;
    avatar_url: string;
    aud: string;
    exp: number;
    iat: number;
  };
};
