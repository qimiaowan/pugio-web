import {
    BaseResponseData,
    PaginationRequestOptions,
} from '@modules/request/request.interface';

export interface Client extends BaseResponseData {
    id: string;
    name: string;
    description: string;
    verified: boolean;
    deviceId: string;
    version?: string;
    publicKey?: string;
    privateKey?: string;
}

export interface QueryClientsRequestOptions extends PaginationRequestOptions {
    roles?: string[];
}

export interface QueryClientsBaseResponseData {
    id: string;
    roleType: number;
    client: Client;
}

export interface QueryClientsResponseDataItem extends BaseResponseData, QueryClientsBaseResponseData {}
