import {
    BaseResponseData,
    PaginationRequestOptions,
} from '@modules/request/request.interface';

export interface Client extends BaseResponseData {
    id: string;
    name: string;
    description: string;
    verified: boolean;
}

export interface QueryClientsRequestOptions extends PaginationRequestOptions {
    roles?: string[];
}

export interface QueryClientsResponseData extends BaseResponseData {
    id: string;
    roleType: number;
    client: Client;
}
