import { Injectable } from 'khamsa';
import { RequestService } from '@modules/request/request.service';
import {
    QueryUsersRequestOptions,
    QueryUsersResponseData,
} from '@modules/user/user.interface';
import { Response } from '@modules/request/request.interface';

@Injectable()
export class UserService {
    public constructor(
        private readonly requestService: RequestService,
    ) {}

    public async queryUsers(
        options: QueryUsersRequestOptions,
    ): Promise<Response<QueryUsersResponseData>> {
        return await this.requestService.getInstance()
            .request({
                url: '/user',
                method: 'get',
                query: options,
            });
    }
}
