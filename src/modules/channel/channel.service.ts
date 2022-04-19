import { Injectable } from 'khamsa';
import { RequestService } from '@modules/request/request.service';
import {
    GetChannelInfoRequestOptions,
    GetChannelInfoResponseData,
    QueryClientChannelsRequestOptions,
    QueryClientChannelResponseDataItem,
} from '@modules/channel/channel.interface';
import {
    PaginationResponseData,
    Response,
} from '@modules/request/request.interface';

@Injectable()
export class ChannelService {
    public constructor(
        private readonly requestService: RequestService,
    ) {}

    public async getChannelInfo(
        options: GetChannelInfoRequestOptions,
    ): Promise<Response<GetChannelInfoResponseData>> {
        const { channelId } = options;

        return await this.requestService.getInstance()
            .request({
                method: 'get',
                url: `/channel/${channelId}/detail`,
            });
    }

    public async queryClientChannels(
        options: QueryClientChannelsRequestOptions,
    ): Promise<PaginationResponseData<QueryClientChannelResponseDataItem>> {
        const {
            clientId,
            ...query
        } = options;

        return await this.requestService.getInstance()
            .request({
                method: 'get',
                url: `/channel/${clientId}`,
                query: query || {},
            });
    }
}
