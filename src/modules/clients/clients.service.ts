import { Injectable } from 'khamsa';
import { RequestService } from '@modules/request/request.service';
import {
    QueryClientsRequestOptions,
    QueryClientsResponseData,
} from '@modules/clients/clients.interface';
import { PaginationResponse } from '@modules/request/request.interface';

@Injectable()
export class ClientsService {
    public constructor(
        private readonly requestService: RequestService,
    ) {}

    public async queryClients(options: QueryClientsRequestOptions): Promise<PaginationResponse<QueryClientsResponseData>> {
        const {
            search = '',
        } = options;

        return await this.requestService.getInstance()
            .request({
                method: 'get',
                url: '/client',
                query: {
                    ...(
                        search
                            ? { search }
                            : {}
                    ),
                },
            });
    }
}
