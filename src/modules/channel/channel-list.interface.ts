export interface ChannelListProps {
    tabId: string;
    clientId: string;
    width: number;
    height: number;
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
