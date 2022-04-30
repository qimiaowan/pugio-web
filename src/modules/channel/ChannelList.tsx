import {
    FC,
    useEffect,
    useState,
    useRef,
    MouseEvent as SyntheticMouseEvent,
    useCallback,
} from 'react';
import { InjectedComponentProps } from 'khamsa';
import {
    ChannelListProps,
    ChannelListItemProps,
    ChannelListCategory,
    ChannelListCategoryPatch,
    ChannelListCategoryPatchMap,
} from '@modules/channel/channel-list.interface';
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
import '@modules/channel/channel-list.component.less';
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
    const [channelListGroups, setChannelListGroups] = useState<InfiniteScrollHookData<QueryClientChannelResponseDataItem>[]>([]);
    const [categories, setCategories] = useState<ChannelListCategory[]>([
        {
            title: 'tabs.builtIn',
            query: {
                builtIn: 1,
            },
            expanded: false,
            loading: false,
        },
        {
            title: 'tabs.thirdParties',
            query: {},
            expanded: false,
            loading: false,
        },
    ]);

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
                    ...(categories[selectedTabIndex].query || {}),
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

    const handleChangeAllCategoriesStatus = useCallback((patches: ChannelListCategoryPatch) => {
        const newCategories = Array.from(categories).map((category) => {
            return {
                ...category,
                ...patches,
            };
        });

        setCategories(newCategories);
    }, [categories]);

    const handleChangeCategoriesStatus = useCallback((patchMap: ChannelListCategoryPatchMap) => {
        const newCategories = Array.from(categories);

        Object.keys(patchMap).forEach((key) => {
            const patches = patchMap[key];
            newCategories[key] = {
                ...newCategories[key],
                ...patches,
            };
        });

        setCategories(newCategories);
    }, [categories]);

    // TODO
    // eslint-disable-next-line no-unused-vars
    const handleLoadMore = useCallback((indexes: number[]) => {
        const newCategories = Array.from(categories);

        handleChangeCategoriesStatus(indexes.reduce((result, index) => {
            result[index] = true;
            return result;
        }, {}));

        Promise.all(indexes.map((index) => {
            const targetCategory = newCategories[index];
            const targetChannelList = channelListGroups[index];
            return channelService.queryClientChannels({
                clientId,
                ...(targetCategory.query || {}),
                search: debouncedSearchValue,
                lastCursor: targetChannelList.lastCursor,
            }).then((response) => {
                const data = response?.response;

                const {
                    items,
                    ...props
                } = data;

                return {
                    index: index.toString(),
                    data: {
                        list: items,
                        ...props,
                    },
                };
            });
        })).then((data) => {
            data.forEach((dataItem) => {
                const {
                    index,
                    data,
                } = dataItem;

                newCategories[index] = data;
            });

            setCategories(newCategories);
        }).finally(() => {
            handleChangeCategoriesStatus(indexes.reduce((result, index) => {
                result[index] = false;
                return result;
            }, {}));
        });
    }, [categories, debouncedSearchValue, channelListGroups]);

    useEffect(() => {
        if (headerRef.current) {
            setHeaderHeight((headerRef.current.clientHeight || 0) + 1);
        }
    }, [headerRef.current]);

    useEffect(() => {
        handleChangeAllCategoriesStatus({
            loading: true,
        });
        Promise.all(categories.map((category) => {
            return channelService.queryClientChannels({
                clientId,
                ...(category.query || {}),
                search: debouncedSearchValue,
            }).then((response) => {
                const data = response?.response;

                const {
                    items,
                    ...props
                } = data;

                return {
                    list: items,
                    ...props,
                };
            });
        })).then((responses) => {
            setChannelListGroups(responses);
        }).finally(() => {
            handleChangeAllCategoriesStatus({
                loading: false,
            });
        });
    }, [debouncedSearchValue]);

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
                        categories.map((tabItem, index) => {
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
