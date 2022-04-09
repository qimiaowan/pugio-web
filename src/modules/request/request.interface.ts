export interface RequestError {
    statusCode: number;
    message: string;
}

export interface Response<T> {
    response?: T;
    error?: RequestError;
}

export interface RefreshTokenRequestOptions {
    refreshToken: string;
}

export interface RefreshTokenResponseData {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface PaginationResponse<T> {
    response?: {
        items: T[];
        remains: number;
        size: number;
        lastCursor?: string;
    };
    error?: RequestError;
}
