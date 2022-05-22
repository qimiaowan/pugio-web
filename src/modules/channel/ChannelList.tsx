import {
    createElement,
    FC,
    useEffect,
    useState,
    useRef,
    useCallback,
} from 'react';
import { InjectedComponentProps } from 'khamsa';
import {
    ChannelListProps,
    ChannelListCategory,
    ChannelListCategoryPatchMap,
    ChannelLoaderMode,
    ChannelListCategoryPatch,
} from '@modules/channel/channel-list.interface';
import { ChannelService } from '@modules/channel/channel.service';
import { useDebounce } from 'ahooks';
import { InfiniteScrollHookData } from '@modules/request/request.interface';
import {
    QueryClientChannelResponseDataItem,
    QueryClientChannelsRequestOptions,
} from '@modules/channel/channel.interface';
import { UtilsService } from '@modules/utils/utils.service';
import _ from 'lodash';
import SimpleBar from 'simplebar-react';
import Box, { BoxProps } from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Icon from '@mui/material/Icon';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { LocaleService } from '@modules/locale/locale.service';
import { LoadingComponent } from '@modules/brand/loading.component';
import clsx from 'clsx';
import { ChannelListItemComponent } from '@modules/channel/channel-list-item.component';
import { ChannelListItemProps } from '@modules/channel/channel-list-item.interface';
import styled from '@mui/material/styles/styled';

const ChannelListContainer = styled(Box)(({ theme }) => {
    return `
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;

        &, * {
            box-sizing: border-box;
        }

        .header {
            width: 100%;
            padding: ${theme.spacing(1)};
            flex-grow: 0;
            flex-shrink: 0;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid ${theme.palette.divider};

            .search-wrapper {
                display: flex;
                align-items: stretch;
                width: 100%;

                .search {
                    width: 240px;
                    flex-grow: 0;
                    flex-shrink: 0;

                    &.full-width {
                        width: initial;
                        min-width: 240px;
                        flex-grow: 1;
                    }
                }
            }
        }

        .list-wrapper {
            flex-grow: 1;
            flex-shrink: 1;
            width: 100%;

            .simplebar-content {
                height: 100%;
                max-width: 100%;
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .channel-list-group-wrapper {
                width: 100%;

                .switch-wrapper {
                    box-sizing: border-box;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    padding: ${theme.spacing(1)};

                    & > .title {
                        user-select: none;
                        color: ${theme.palette.text.primary};
                        margin-left: ${theme.spacing(1)};
                    }
                }

                .channels-list-wrapper {
                    flex-shrink: 0;
                    width: 100%;
                    overflow: hidden;

                    &.hidden {
                        height: 0;
                    }

                    .load-more-wrapper {
                        padding: ${theme.spacing(1)};
                        width: 100%;
                        display: block;
                        user-select: none;

                        & > div {
                            width: 100%;
                            height: 100;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                    }
                }
            }
        }

        .loading-wrapper {
            height: 300px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    `;
});

const ChannelList: FC<InjectedComponentProps<ChannelListProps>> = (listProps) => {
    const {
        declarations,
        clientId,
        width,
        height,
        headerSlot,
        listItemProps,
        headerProps = {},
        searchProps = {},
        onSelectChannel = _.noop,
    } = listProps;

    const channelService = declarations.get<ChannelService>(ChannelService);
    const utilsService = declarations.get<UtilsService>(UtilsService);
    const localeService = declarations.get<LocaleService>(LocaleService);
    const Loading = declarations.get<FC<BoxProps>>(LoadingComponent);
    const ChannelListItem = declarations.get<FC<ChannelListItemProps>>(ChannelListItemComponent);

    const getLocaleText = localeService.useLocaleContext('components.channelList');
    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedSearchValue = useDebounce(searchValue, { wait: 500 });
    const headerRef = useRef<HTMLDivElement>(null);
    const [headerHeight, setHeaderHeight] = useState<number>(0);
    const [channelListGroups, setChannelListGroups] = useState<InfiniteScrollHookData<QueryClientChannelResponseDataItem>[]>([]);
    const [categories, setCategories] = useState<ChannelListCategory[]>([
        {
            title: 'tabs.official',
            query: {
                builtIn: 1,
            },
            expanded: true,
            loading: false,
            loadingMore: false,
        },
        {
            title: 'tabs.fromMarket',
            query: {
            },
            expanded: true,
            loading: false,
            loadingMore: false,
        },
    ]);

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

    const handleLoadChannels = useCallback(
        (indexes: number[], query: Record<string, any> = {}, mode: ChannelLoaderMode = 'search') => {
            const newCategories = Array.from(categories);

            handleChangeCategoriesStatus(indexes.reduce((result, index) => {
                const patch = {} as ChannelListCategoryPatch;

                switch (mode) {
                    case 'loadMore': {
                        patch.loadingMore = true;
                        patch.loading = false;
                        break;
                    }
                    case 'search': {
                        patch.loadingMore = false;
                        patch.loading = true;
                    }
                }

                result[index] = patch;

                return result;
            }, {} as ChannelListCategoryPatchMap));

            Promise.all(indexes.map((index) => {
                const targetCategory = newCategories[index];
                const targetChannelList = channelListGroups[index];
                const options: QueryClientChannelsRequestOptions = {
                    clientId,
                    ...(targetCategory.query || {}),
                    ...query,
                    status: 1,
                };

                switch (mode) {
                    case 'loadMore': {
                        options.lastCursor = targetChannelList.lastCursor;
                        break;
                    }
                    default:
                        break;
                }

                return channelService.queryClientChannels(options).then((response) => {
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
                            lastCursor: _.get(_.last(items), 'id'),
                        },
                    };
                });
            })).then((data) => {
                const newChannelListGroups = Array.from(channelListGroups);

                data.forEach((dataItem) => {
                    const {
                        index,
                        data,
                    } = dataItem;

                    const indexNumber = parseInt(index, 10);
                    const currentList = Array.from(newChannelListGroups[indexNumber]?.list || []);
                    newChannelListGroups[indexNumber] = data;

                    switch (mode) {
                        case 'loadMore': {
                            newChannelListGroups[indexNumber].list = currentList.concat(data.list || []);
                            break;
                        }
                        default:
                            break;
                    }
                });

                setChannelListGroups(newChannelListGroups);
            }).finally(() => {
                handleChangeCategoriesStatus(indexes.reduce((result, index) => {
                    result[index] = false;
                    return result;
                }, {}));
            });
        },
        [categories, channelListGroups],
    );

    useEffect(() => {
        if (headerRef.current) {
            setHeaderHeight((headerRef.current.clientHeight || 0) + 1);
        }
    }, [headerRef.current]);

    useEffect(() => {
        handleLoadChannels(
            new Array(categories.length)
                .fill(null)
                .map((value, index) => index),
            {
                search: debouncedSearchValue,
            },
            'search',
        );
    }, [debouncedSearchValue]);

    return (
        <ChannelListContainer className="channel-list-container" style={{ width }}>
            <Box className="header" {...headerProps} ref={headerRef}>
                <Box className="search-wrapper">
                    <TextField
                        {...searchProps}
                        classes={{
                            root: clsx('search', {
                                'full-width': !headerSlot,
                            }),
                        }}
                        placeholder={getLocaleText('searchPlaceholder')}
                        onChange={(event) => setSearchValue(event.target.value)}
                    />
                    {headerSlot}
                </Box>
            </Box>
            <SimpleBar
                className="list-wrapper"
                style={{
                    height: height - headerHeight,
                }}
            >
                {
                    categories.map((category, index) => {
                        const channelList = channelListGroups[index];
                        return (
                            <Box key={index} className="channel-list-group-wrapper">
                                <Box className="switch-wrapper">
                                    <IconButton
                                        onClick={() => {
                                            handleChangeCategoriesStatus({
                                                [index]: {
                                                    expanded: !categories[index].expanded,
                                                },
                                            });
                                        }}
                                    >
                                        <Icon className={`icon-keyboard-arrow-${category?.expanded ? 'down' : 'right'}`} />
                                    </IconButton>
                                    <Typography classes={{ root: 'title' }}>
                                        {getLocaleText(category.title)}
                                        {
                                            !(category.loading || category.loadingMore) && (
                                                ` (${channelList?.list?.length || 0 + channelList?.remains || 0})`
                                            )
                                        }
                                    </Typography>
                                </Box>
                                {
                                    category?.loading
                                        ? <Box className="loading-wrapper"><Loading/></Box>
                                        : <Box
                                            className={clsx('channels-list-wrapper', {
                                                hidden: !category?.expanded,
                                            })}
                                        >
                                            {
                                                (channelList?.list || []).map((item) => {
                                                    const props = {
                                                        key: item?.id,
                                                        builtIn: category?.query?.builtIn === 1,
                                                        data: item?.channel,
                                                        width: utilsService.calculateItemWidth(width, 120),
                                                        menu: [
                                                            {
                                                                icon: 'icon-info',
                                                                title: getLocaleText('info'),
                                                            },
                                                            ...(
                                                                category?.query?.builtIn !== 1
                                                                    ? [
                                                                        {
                                                                            icon: 'icon-delete',
                                                                            title: getLocaleText('delete'),
                                                                        },
                                                                    ]
                                                                    : []
                                                            ),
                                                        ],
                                                        onClick: () => {
                                                            onSelectChannel(item.channel);
                                                        },
                                                    } as ChannelListItemProps;
                                                    return createElement(
                                                        ChannelListItem,
                                                        {
                                                            ...props,
                                                            ...(
                                                                listItemProps
                                                                    ? _.isFunction(listItemProps)
                                                                        ? (listItemProps(props, listProps) || {})
                                                                        : listItemProps
                                                                    : {}
                                                            ),
                                                        },
                                                    );
                                                })
                                            }
                                            {
                                                channelList?.remains > 0 && (
                                                    <Box className="load-more-wrapper">
                                                        <Box>
                                                            <Button
                                                                variant="text"
                                                                classes={{ root: 'load-more-button' }}
                                                                disabled={category.loadingMore}
                                                                onClick={() => handleLoadChannels([index], {}, 'loadMore')}
                                                            >
                                                                {
                                                                    category.loadingMore
                                                                        ? getLocaleText('loading')
                                                                        : channelList?.remains === 0
                                                                            ? getLocaleText('noMore')
                                                                            : getLocaleText('loadMore')
                                                                }
                                                            </Button>
                                                        </Box>
                                                    </Box>
                                                )
                                            }
                                        </Box>
                                }
                                <Divider />
                            </Box>
                        );
                    })
                }
            </SimpleBar>
        </ChannelListContainer>
    );
};

export default ChannelList;
