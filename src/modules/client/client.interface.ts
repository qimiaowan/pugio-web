import { Profile } from '@modules/profile/profile.interface';
import {
    Client,
    QueryClientsResponseDataItem,
} from '@modules/clients/clients.interface';
import { PaginationRequestOptions } from '@modules/request/request.interface';

export interface UserClientRelationRequestOptions {
    clientId: string;
}

export interface UserClientRelationResponseData extends QueryClientsResponseDataItem {
    user: Profile;
}

export interface GetClientInformationRequestOptions {
    clientId: string;
}

export type GetClientInformationResponseData = Client;

export interface GetClientCurrentStatusRequestOptions {
    clientId: string;
    offlineThreshold?: number;
}

export interface GetClientCurrentStatusResponseData {
    offline: boolean;
    statusCode: number;
}

export interface QueryClientMembersRequestOptions extends PaginationRequestOptions {
    clientId: string;
    role: number;
}

export type QueryClientMembersResponseDataItem = Omit<UserClientRelationResponseData, 'client'>;
