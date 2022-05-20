import { TextFieldProps } from '@mui/material/TextField';
import { BoxProps } from '@mui/material/Box';
import { ReactNode } from 'react';

export interface ChannelListProps {
    tabId: string;
    clientId: string;
    width: number;
    height: number;
    headerSlot?: ReactNode;
    headerProps?: BoxProps;
    searchProps?: TextFieldProps;
    onSelectChannel?: (channelId: string) => void;
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
