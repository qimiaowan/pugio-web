import { ChannelTab } from '@modules/store/store.interface';
import { BoxProps } from '@mui/material/Box';
import { Profile } from '@modules/profile/profile.interface';

export interface ChannelPanelProps extends BoxProps {
    tabId: string;
    channelTab?: Omit<ChannelTab, 'tabId'>;
}

export interface Channel {
    id: string;
    name: string;
    packageName: string;
    avatar: string;
    bundleUrl: string;
    registry: string;
    apiPrefix: string;
    status: number;
    creator: Profile;
    createdAt: string;
    updatedAt: string;
    description?: string;
}

export interface GetChannelInfoRequestOptions {
    channelId: string;
}

export type GetChannelInfoResponseData = Channel;
