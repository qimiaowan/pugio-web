import { Injectable } from 'khamsa';
import { RequestService } from '@modules/request/request.service';
import { Response } from '@modules/request/request.interface';
import {
    GetClientCurrentStatusRequestOptions,
    GetClientCurrentStatusResponseData,
    GetClientInformationRequestOptions,
    GetClientInformationResponseData,
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

    public async getClientInformation(
        options: GetClientInformationRequestOptions,
    ): Promise<Response<GetClientInformationResponseData>> {
        const { clientId } = options;

        return await this.requestService.getInstance()
            .request({
                method: 'get',
                url: `/client/${clientId}`,
            });
    }

    public async getClientCurrentStatus(
        options: GetClientCurrentStatusRequestOptions,
    ): Promise<Response<GetClientCurrentStatusResponseData>> {
        const {
            clientId,
            offlineThreshold = 150000,
        } = options;

        return await this.requestService.getInstance()
            .request({
                method: 'get',
                url: `/client_status/${clientId}`,
                query: {
                    offlineThreshold,
                },
            });
    }
}
