import { ChannelTab } from '@modules/store/store.interface';
import { BoxProps } from '@mui/material/Box';
import { Profile } from '@modules/profile/profile.interface';
import {
    BaseResponseData,
    PaginationRequestOptions,
} from '@modules/request/request.interface';

export interface ChannelPanelProps extends BoxProps {
    tabId: string;
    channelTab?: Omit<ChannelTab, 'tabId'>;
}

export interface Channel extends BaseResponseData {
    id: string;
    name: string;
    packageName: string;
    avatar: string;
    bundleUrl: string;
    registry: string;
    apiPrefix: string;
    status: number;
    creator: Profile;
    description?: string;
}

export interface GetChannelInfoRequestOptions {
    channelId: string;
}

export type GetChannelInfoResponseData = Channel;

export interface QueryClientChannelsRequestData extends PaginationRequestOptions {
    builtIn?: number;
}

export interface QueryClientChannelsRequestOptions extends QueryClientChannelsRequestData {
    clientId: string;
}

export interface QueryClientChannelResponseDataItem extends BaseResponseData {
    id: string;
    channel: Channel & {
        creator: Profile;
    };
}
