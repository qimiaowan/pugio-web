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
import { LocaleService } from '@modules/locale/locale.service';
import { LoadingComponent } from '@modules/brand/loading.component';
import '@modules/channel/channel-list.component.less';

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
    const headerRef = useRef<HTMLDivElement>(null);
    const [headerHeight, setHeaderHeight] = useState<number>(0);
    const [channelListGroups, setChannelListGroups] = useState<InfiniteScrollHookData<QueryClientChannelResponseDataItem>[]>([]);
    const [categories, setCategories] = useState<ChannelListCategory[]>([
        {
            title: 'tabs.builtIn',
            query: {
                builtIn: 1,
            },
            expanded: true,
            loading: false,
            loadingMore: false,
        },
        {
            title: 'tabs.thirdParties',
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
        <Box className="channel-list-container">
            <Box className="header" ref={headerRef}>
                <Box className="search-wrapper">
                    <TextField
                        classes={{
                            root: 'search',
                        }}
                        placeholder={getLocaleText('searchPlaceholder')}
                        onChange={(event) => setSearchValue(event.target.value)}
                    />
                    <Button
                        startIcon={<Icon className="icon-plus" />}
                    >{getLocaleText('create')}</Button>
                </Box>
            </Box>
            <SimpleBar
                className="list-wrapper"
                style={{
                    width,
                    height: height - headerHeight,
                }}
            >
                {
                    categories.map((category, index) => {
                        const channelList = channelListGroups[index];
                        return (
                            <Box key={index} style={{ width: '100%' }}>
                                <Box>
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
                                </Box>
                                {
                                    category?.expanded
                                        ? category?.loading
                                            ? <Box className="loading-wrapper"><Loading/></Box>
                                            : <Box className="channels-list-wrapper">
                                                {
                                                    (channelList?.list || []).map((item) => {
                                                        return (
                                                            <ChannelListItem
                                                                key={item.id}
                                                                builtIn={category?.query?.builtIn === 1}
                                                                data={item.channel}
                                                                width={utilsService.calculateItemWidth(width, 120)}
                                                                onClick={() => {
                                                                    onSelectChannel(item.channel.id);
                                                                }}
                                                            />
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
                                        : null
                                }
                            </Box>
                        );
                    })
                }
            </SimpleBar>
        </Box>
    );
};

export default ChannelList;
