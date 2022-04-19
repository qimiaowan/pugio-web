/* eslint-disable no-unused-vars */
import {
    FC,
    useState,
} from 'react';
import { InjectedComponentProps } from 'khamsa';
import { ChannelListProps } from '@modules/client/channel-list.interface';
import { ChannelService } from '@modules/channel/channel.service';
import { useDebounce } from 'ahooks';
import { InfiniteScrollHookData } from '@modules/request/request.interface';
import { QueryClientChannelResponseDataItem } from '@modules/channel/channel.interface';
import { UtilsService } from '@modules/utils/utils.service';
import _ from 'lodash';

const ChannelList: FC<InjectedComponentProps<ChannelListProps>> = ({
    declarations,
    clientId,
}) => {
    const channelService = declarations.get<ChannelService>(ChannelService);
    const utilsService = declarations.get<UtilsService>(UtilsService);

    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedSearchValue = useDebounce(searchValue, { wait: 500 });

    const {
        data: queryClientChannelsResponseData,
        loadMore: queryMoreClientChannels,
        loading: queryClientChannelsLoading,
        loadingMore: queryClientChannelsLoadingMore,
    } = utilsService.useLoadMore<QueryClientChannelResponseDataItem>(
        (data: InfiniteScrollHookData<QueryClientChannelResponseDataItem>) => {
            return channelService.queryClientChannels(_.omit(
                {
                    clientId,
                    ...data,
                    search: debouncedSearchValue,
                },
                ['list'],
            ));
        },
        {
            reloadDeps: [debouncedSearchValue],
        },
    );

    return (<></>);
};

export default ChannelList;
