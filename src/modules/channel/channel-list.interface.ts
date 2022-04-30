import { Channel } from '@modules/channel/channel.interface';
import { BoxProps } from '@mui/material/Box';

export interface ChannelListProps {
    tabId: string;
    clientId: string;
    width: number;
    height: number;
    onSelectChannel?: (channelId: string) => void;
}

export interface ChannelListItemProps extends BoxProps {
    data: Channel;
    width: number;
    builtIn?: boolean;
    onDelete?: (data: Channel) => void;
}

export interface ChannelListCategory extends Required<ChannelListCategoryPatch> {
    title: string;
    query: Record<string, any>;
}

export interface ChannelListCategoryPatch {
    loading?: boolean;
    expanded?: boolean;
}

export type ChannelListCategoryPatchMap = Record<string, ChannelListCategoryPatch>;
