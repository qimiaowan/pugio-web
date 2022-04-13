import { Profile } from '@modules/profile/profile.interface';
import { QueryClientsResponseData } from '@modules/clients/clients.interface';

export interface UserClientRelationRequestOptions {
    clientId: string;
}

export interface UserClientRelationResponseData extends QueryClientsResponseData {
    user: Profile;
}
