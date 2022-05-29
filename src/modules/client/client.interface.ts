import { Profile } from '@modules/profile/profile.interface';
import {
    Client,
    QueryClientsResponseDataItem,
} from '@modules/clients/clients.interface';
import {
    BaseResponseData,
    PaginationRequestOptions,
} from '@modules/request/request.interface';

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
    role: number[];
}

export type QueryClientMembersResponseDataItem = Omit<UserClientRelationResponseData, 'client'>;

export interface ClientMembership {
    userId: string;
    roleType: number;
}

export interface DeleteClientMembersRequestOptions {
    clientId: string;
    users?: string[];
}

export type DeleteClientMembersResponseData = UserClientRelationResponseData[];

export interface AddClientMembersRequestOptions {
    clientId: string;
    memberships: ClientMembership[];
}

export interface AddClientMembersResponseDataItem extends BaseResponseData {
    id: string;
    roleType: number;
    user: Partial<Profile>;
    client: Partial<Client>;
}

export type AddClientMembersResponseData = AddClientMembersResponseDataItem[];

export type ChangeClientMembershipRequestOptions = AddClientMembersRequestOptions;

export type ChangeClientMembershipResponseDataItem = AddClientMembersResponseDataItem;

export type ChangeClientMembershipResponseData = ChangeClientMembershipResponseDataItem[];

export interface GetSystemStatusRequestOptions {
    clientId: string;
    pathname: string;
    dateRange: [Date, Date];
    count?: number;
}

export interface SystemOSInfo {
    platform: string;
    distro: string;
    release: string;
    codename: string;
    kernel: string;
    arch: string;
    hostname: string;
    fqdn: string;
    codepage: string;
    logofile: string;
    serial: string;
    build: string;
    servicepack: string;
    uefi: boolean;
}

export interface SystemStatistic extends BaseResponseData {
    data: any;
}

export interface GetSystemStatusResponseData {
    os: SystemOSInfo;
    count: number;
    statistics: SystemStatistic[];
}
