import { Profile } from '@modules/profile/profile.interface';
import {
    Client,
    QueryClientsResponseData,
} from '@modules/clients/clients.interface';

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
