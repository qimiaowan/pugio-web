import { PaginationRequestOptions } from '@modules/request/request.interface';
import { Profile } from '@modules/profile/profile.interface';

export type QueryUsersRequestOptions = PaginationRequestOptions;

export type QueryUsersResponseDataItem = Profile;
