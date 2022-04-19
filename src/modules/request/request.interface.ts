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

export interface BaseResponseData {
    createdAt: string;
    updatedAt: string;
}

export interface PaginationInfo {
    remains?: number;
    size?: number;
    lastCursor?: string;
}

export type TDateRangeItem = Date | null;
export type TDateRange = [TDateRangeItem, TDateRangeItem];

export interface PaginationResponseData<T = any> {
    response?: { items: T[]; } & PaginationInfo;
    error?: RequestError;
}

export interface PaginationRequestOptions {
    search?: string;
    lastCursor?: string;
    size?: number;
    createDateRange?: TDateRange;
}

export interface InfiniteScrollHookData<D = any> extends PaginationInfo {
    list: D[];
}
