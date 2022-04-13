import { Injectable } from 'khamsa';
import { RequestService } from '@modules/request/request.service';
import { Response } from '@modules/request/request.interface';
import {
    UserClientRelationRequestOptions,
    UserClientRelationResponseData,
} from '@modules/client/client.interface';

@Injectable()
export class ClientService {
    public constructor(
        private readonly requestService: RequestService,
    ) {}

    public async getUserClientRelation(
        options: UserClientRelationRequestOptions,
    ): Promise<Response<UserClientRelationResponseData>> {
        const { clientId } = options;

        return await this.requestService.getInstance()
            .request({
                method: 'get',
                url: '/client/relation',
                query: { clientId },
            });
    }
}
