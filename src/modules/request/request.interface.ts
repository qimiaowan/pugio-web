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

export interface PaginationInfo {
    remains?: number;
    size?: number;
    lastCursor?: string;
}

export interface PaginationResponse<T = any> {
    response?: { items: T[]; } & PaginationInfo;
    error?: RequestError;
}

export interface InfiniteScrollHookData<D = any> extends PaginationInfo {
    list: D[];
}
