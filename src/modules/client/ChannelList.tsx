/* eslint-disable no-unused-vars */
import {
    FC,
    useState,
} from 'react';
import { InjectedComponentProps } from 'khamsa';
import { ChannelListProps } from '@modules/client/channel-list.interface';
import { ChannelService } from '@modules/channel/channel.service';
import {
    useDebounce,
    useInfiniteScroll,
} from 'ahooks';
import { InfiniteScrollHookData } from '@modules/request/request.interface';
import { QueryClientChannelResponseDataItem } from '@modules/channel/channel.interface';
import _ from 'lodash';

const ChannelList: FC<InjectedComponentProps<ChannelListProps>> = ({
    declarations,
    clientId,
}) => {
    const channelService = declarations.get<ChannelService>(ChannelService);

    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedSearchValue = useDebounce(searchValue, { wait: 500 });

    const {
        data: queryClientChannelsResponseData,
        loadMore: queryMoreClientChannels,
        loading: queryClientChannelsLoading,
        loadingMore: queryClientChannelsLoadingMore,
    } = useInfiniteScroll(
        async (data: InfiniteScrollHookData<QueryClientChannelResponseDataItem>) => {
            const response = await channelService.queryClientChannels(_.omit(
                {
                    clientId,
                    ...data,
                    search: debouncedSearchValue,
                },
                ['list'],
            ));

            return {
                list: response?.response?.items || [],
                ...(_.omit(_.get(response, 'response'), ['items', 'lastCursor']) || {}),
                lastCursor: _.get(Array.from(response?.response?.items || []).pop(), 'id') || null,
            };
        },
        {
            isNoMore: (data) => data && data.remains === 0,
            reloadDeps: [debouncedSearchValue],
        },
    );

    return (<></>);
};

export default ChannelList;
