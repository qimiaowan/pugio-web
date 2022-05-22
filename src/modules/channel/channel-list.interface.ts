import { TextFieldProps } from '@mui/material/TextField';
import { BoxProps } from '@mui/material/Box';
import { ReactNode } from 'react';
import { Channel } from '@modules/channel/channel.interface';
import { ChannelListItemProps } from '@modules/channel/channel-list-item.interface';

type ChannelListItemPropsCreator = (itemProps: ChannelListItemProps, listProps: ChannelListProps) => Partial<ChannelListItemProps>;

export interface ChannelListProps {
    clientId: string;
    width: number;
    height: number;
    listItemProps?: Partial<ChannelListItemProps> | ChannelListItemPropsCreator;
    headerSlot?: ReactNode;
    headerProps?: BoxProps;
    searchProps?: TextFieldProps;
    onSelectChannel?: (channel: Channel) => void;
}

export interface ChannelListCategory extends Required<ChannelListCategoryPatch> {
    title: string;
    query: Record<string, any>;
}

export interface ChannelListCategoryPatch {
    loadingMore?: boolean;
    loading?: boolean;
    expanded?: boolean;
}

export type ChannelListCategoryPatchMap = Record<string, ChannelListCategoryPatch>;

export type ChannelLoaderMode = 'loadMore' | 'search';
