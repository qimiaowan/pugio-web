import { Injectable } from 'khamsa';
import { RequestService } from '@modules/request/request.service';
import {
    QueryUsersRequestOptions,
    QueryUsersResponseDataItem,
} from '@modules/user/user.interface';
import { PaginationResponseData } from '@modules/request/request.interface';

@Injectable()
export class UserService {
    public constructor(
        private readonly requestService: RequestService,
    ) {}

    public async queryUsers(
        options: QueryUsersRequestOptions,
    ): Promise<PaginationResponseData<QueryUsersResponseDataItem>> {
        return await this.requestService.getInstance()
            .request({
                url: '/user',
                method: 'get',
                query: options,
            });
    }
}
