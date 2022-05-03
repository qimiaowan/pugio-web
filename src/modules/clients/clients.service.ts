import { Injectable } from 'khamsa';
import { RequestService } from '@modules/request/request.service';
import {
    QueryClientsRequestOptions,
    QueryClientsResponseDataItem,
} from '@modules/clients/clients.interface';
import { PaginationResponseData } from '@modules/request/request.interface';
import { UtilsService } from '@modules/utils/utils.service';

@Injectable()
export class ClientsService {
    public constructor(
        private readonly requestService: RequestService,
        private readonly utilsService: UtilsService,
    ) {}

    public async queryClients(options: QueryClientsRequestOptions): Promise<PaginationResponseData<QueryClientsResponseDataItem>> {
        const {
            search,
            lastCursor,
            size,
            roles = [],
            createDateRange,
        } = options;

        return await this.requestService.getInstance()
            .request({
                method: 'get',
                url: '/client',
                query: {
                    search,
                    lastCursor,
                    size,
                    roles: roles.join(','),
                    createDateRange: this.utilsService.serializeDateRange(createDateRange),
                },
            });
    }
}
