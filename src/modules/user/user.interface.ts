import {
    PaginationRequestOptions,
    PaginationResponseData,
} from '@modules/request/request.interface';
import { Profile } from '@modules/profile/profile.interface';

export type QueryUsersRequestOptions = PaginationRequestOptions;

export type QueryUsersResponseData = PaginationResponseData<Profile>;

