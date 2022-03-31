import {
    AxiosRequestConfig,
    AxiosRequestHeaders,
} from 'axios';

export interface Response<T = any, E = any> {
    response: T;
    error: E;
}

export type RequestInfo = string | Request;

export interface RequestConfig<D> extends AxiosRequestConfig<D> {
    query?: Record<string, any>;
}

export interface RequestOptions {
    headers?: AxiosRequestHeaders;
    requestConfig?: AxiosRequestConfig;
    json?: boolean;
    transformCase?: boolean;
}

export interface ResponseGetInstanceOptions extends Partial<AxiosRequestConfig> {
    json?: boolean;
}
