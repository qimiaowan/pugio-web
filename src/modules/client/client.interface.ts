import { Profile } from '@modules/profile/profile.interface';
import {
    Client,
    QueryClientsResponseData,
} from '@modules/clients/clients.interface';
import {
    PaginationRequestOptions,
    PaginationResponseData,
} from '@modules/request/request.interface';

export interface UserClientRelationRequestOptions {
    clientId: string;
}

export interface UserClientRelationResponseData extends QueryClientsResponseData {
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

export type QueryClientMemberItem = Omit<UserClientRelationResponseData, 'client'>;
export type QueryClientMembersResponseData = PaginationResponseData<QueryClientMemberItem>;
