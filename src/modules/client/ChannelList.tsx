/* eslint-disable no-unused-vars */
import {
    FC,
    useEffect,
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
import SimpleBar from 'simplebar-react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import TextField from '@mui/material/TextField';
import { LocaleService } from '@modules/locale/locale.service';
import '@modules/client/channel-list.component.less';

const ChannelList: FC<InjectedComponentProps<ChannelListProps>> = ({
    declarations,
    clientId,
}) => {
    const tabs = [
        {
            title: 'tabs.builtIn',
            query: {
                builtIn: 1,
            },
        },
        {
            title: 'tabs.thirdParties',
            query: {},
        },
    ];

    const channelService = declarations.get<ChannelService>(ChannelService);
    const utilsService = declarations.get<UtilsService>(UtilsService);
    const localeService = declarations.get<LocaleService>(LocaleService);

    const getLocaleText = localeService.useLocaleContext('components.channelList');
    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedSearchValue = useDebounce(searchValue, { wait: 500 });
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);

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

    useEffect(() => {
        console.log(queryClientChannelsResponseData);
    }, [queryClientChannelsResponseData]);

    return (
        <Box className="channel-list-container">
            <Box className="header">
                <Box className="search-wrapper">
                    <TextField
                        classes={{
                            root: 'search',
                        }}
                    />
                    <Button
                        startIcon={<Icon className="icon-plus" />}
                    >{getLocaleText('create')}</Button>
                </Box>
                <Tabs
                    value={selectedTabIndex}
                    classes={{
                        root: 'tabs',
                    }}
                >
                    {
                        tabs.map((tabItem) => {
                            return (
                                <Tab
                                    key={tabItem.title}
                                    label={getLocaleText(tabItem.title)}
                                />
                            );
                        })
                    }
                </Tabs>
            </Box>
            <SimpleBar className="list-wrapper"></SimpleBar>
        </Box>
    );
};

export default ChannelList;
