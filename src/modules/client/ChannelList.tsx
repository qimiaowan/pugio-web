import {
    FC,
    useEffect,
    useState,
    useRef,
    MouseEvent as SyntheticMouseEvent,
} from 'react';
import { InjectedComponentProps } from 'khamsa';
import {
    ChannelListProps,
    ChannelListItemProps,
} from '@modules/client/channel-list.interface';
import { ChannelService } from '@modules/channel/channel.service';
import { useDebounce } from 'ahooks';
import { InfiniteScrollHookData } from '@modules/request/request.interface';
import { QueryClientChannelResponseDataItem } from '@modules/channel/channel.interface';
import { UtilsService } from '@modules/utils/utils.service';
import _ from 'lodash';
import SimpleBar from 'simplebar-react';
import Box, { BoxProps } from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { LocaleService } from '@modules/locale/locale.service';
import '@modules/client/channel-list.component.less';
import { LoadingComponent } from '@modules/brand/loading.component';

const ChannelListItem: FC<ChannelListItemProps> = ({
    data = {},
    style,
    builtIn = false,
    width,
    onClick,
    // onDelete = _.noop,
}) => {
    const {
        name,
        avatar,
    } = data;

    const handleAction = (event: SyntheticMouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation();
        event.preventDefault();
    };

    const [opacity, setOpacity] = useState<number>(0);
    const [bgColor, setBgColor] = useState<string>('transparent');
    const [mouseStay, setMouseStay] = useState<boolean>(false);

    useEffect(() => {
        setBgColor(mouseStay ? '#f9f9f9' : 'transparent');
    }, [mouseStay]);

    return (
        <div
            className="channel-list-item"
            style={{
                backgroundColor: bgColor,
                ...style,
                width,
            }}
            onMouseEnter={() => {
                setOpacity(1);
                setMouseStay(true);
            }}
            onMouseLeave={() => {
                setOpacity(0);
                setMouseStay(false);
            }}
            onMouseDown={() => {
                setBgColor('#f3f3f3');
            }}
            onMouseUp={() => {
                setBgColor('#f9f9f9');
            }}
            onClick={onClick}
        >

            <Box className="action-wrapper" style={{ opacity }}>
                <IconButton
                    onMouseDown={(event) => event.stopPropagation()}
                    onMouseUp={(event) => event.stopPropagation()}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                >
                    <Icon className="icon icon-info" />
                </IconButton>
                {
                    !builtIn && (
                        <IconButton
                            onClick={handleAction}
                            onMouseDown={(event) => event.stopPropagation()}
                            onMouseUp={(event) => event.stopPropagation()}
                        >
                            <Icon className="icon icon-delete" />
                        </IconButton>
                    )
                }
            </Box>
            <Box className="content-wrapper">
                <Box
                    component="img"
                    style={{
                        width: width * 0.3,
                        height: width * 0.3,
                    }}
                    src={avatar || '/static/images/channel_avatar_fallback.svg'}
                />
                <Typography classes={{ root: 'text' }} variant="subtitle2">{name}</Typography>
            </Box>
        </div>
    );
};

const ChannelList: FC<InjectedComponentProps<ChannelListProps>> = ({
    declarations,
    clientId,
    width,
    height,
    onSelectChannel = _.noop,
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
    const Loading = declarations.get<FC<BoxProps>>(LoadingComponent);

    const getLocaleText = localeService.useLocaleContext('components.channelList');
    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedSearchValue = useDebounce(searchValue, { wait: 500 });
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
    const headerRef = useRef<HTMLDivElement>(null);
    const [headerHeight, setHeaderHeight] = useState<number>(0);

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
                    ...(tabs[selectedTabIndex].query || {}),
                    search: debouncedSearchValue,
                },
                ['list'],
            ));
        },
        {
            reloadDeps: [
                debouncedSearchValue,
                selectedTabIndex,
            ],
        },
    );

    useEffect(() => {
        if (headerRef.current) {
            setHeaderHeight((headerRef.current.clientHeight || 0) + 1);
        }
    }, [headerRef.current]);

    return (
        <Box className="channel-list-container">
            <Box className="header" ref={headerRef}>
                <Box className="search-wrapper">
                    <TextField
                        classes={{
                            root: 'search',
                        }}
                        placeholder={getLocaleText('searchPlaceholder')}
                        disabled={queryClientChannelsLoading || queryClientChannelsLoadingMore}
                        onChange={(event) => setSearchValue(event.target.value)}
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
                        tabs.map((tabItem, index) => {
                            return (
                                <Tab
                                    key={tabItem.title}
                                    label={getLocaleText(tabItem.title)}
                                    onClick={() => setSelectedTabIndex(index)}
                                />
                            );
                        })
                    }
                </Tabs>
            </Box>
            {
                queryClientChannelsLoading
                    ? <Box className="loading-wrapper">
                        <Loading />
                    </Box>
                    : (!queryClientChannelsResponseData?.list || queryClientChannelsResponseData?.list?.length === 0)
                        ? <Box></Box>
                        : <SimpleBar
                            className="list-wrapper"
                            style={{
                                width,
                                height: height - headerHeight,
                            }}
                        >
                            <Box className="channels-list-wrapper">
                                {
                                    queryClientChannelsResponseData.list.map((item) => {
                                        return (
                                            <ChannelListItem
                                                key={item.id}
                                                builtIn={selectedTabIndex === 0}
                                                data={item.channel}
                                                width={utilsService.calculateItemWidth(width, 120)}
                                                onClick={() => {
                                                    onSelectChannel(item.channel.id);
                                                }}
                                            />
                                        );
                                    })
                                }
                                <Box className="load-more-wrapper">
                                    <Box>
                                        <Button
                                            variant="text"
                                            classes={{ root: 'load-more-button' }}
                                            disabled={queryClientChannelsLoadingMore || queryClientChannelsResponseData?.remains === 0}
                                            onClick={queryMoreClientChannels}
                                        >
                                            {
                                                queryClientChannelsLoadingMore
                                                    ? getLocaleText('loading')
                                                    : queryClientChannelsResponseData?.remains === 0
                                                        ? getLocaleText('noMore')
                                                        : getLocaleText('loadMore')
                                            }
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </SimpleBar>
            }
        </Box>
    );
};

export default ChannelList;
