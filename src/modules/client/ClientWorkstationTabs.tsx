/* eslint-disable no-unused-vars */
import {
    FC,
    useEffect,
    useRef,
    useState,
    useCallback,
    Suspense,
} from 'react';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { InjectedComponentProps } from 'khamsa';
import { TabProps } from '@modules/tab/tab.interface';
import { TabComponent } from '@modules/tab/tab.component';
import { LocaleService } from '@modules/locale/locale.service';
import { StoreService } from '@modules/store/store.service';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import {
    StyledEngineProvider,
    useTheme,
} from '@mui/material/styles';
import _ from 'lodash';
import shallow from 'zustand/shallow';
import SimpleBar from 'simplebar-react';
import {
    ChannelTab,
    ChannelMetadata,
    LoadedChannelProps,
    TabData,
} from '@modules/store/store.interface';
import { ClientService } from '@modules/client/client.service';
import { ChannelService } from '@modules/channel/channel.service';
import { UtilsService } from '@modules/utils/utils.service';
import { useParams } from 'react-router-dom';
import { List } from 'immutable';
import { useDebounce } from 'ahooks';
import { AppComponent as WebTerminalAppComponent } from '@builtin:web-terminal/app.component';
import { ChannelListComponent } from '@modules/channel/channel-list.component';
import { ChannelListProps } from '@modules/channel/channel-list.interface';
import { PopoverProps } from '@modules/common/popover.interface';
import { PopoverComponent } from '@modules/common/popover.component';
import { ClientWorkstationTabsProps } from '@modules/client/client-workstation-tabs.interface';

const ClientWorkstationTabs: FC<InjectedComponentProps<ClientWorkstationTabsProps>> = ({
    declarations,
    panelHeight,
    headerWidth,
    selectedTabId,
    selectedTabMetadata = [],
    tabs = [],
    onGoHome = _.noop,
    onSelectedTabIdChange = _.noop,
    onCreateTab = _.noop,
}) => {
    const Tab = declarations.get<FC<TabProps>>(TabComponent);
    const localeService = declarations.get<LocaleService>(LocaleService);
    const storeService = declarations.get<StoreService>(StoreService);
    const clientService = declarations.get<ClientService>(ClientService);
    const channelService = declarations.get<ChannelService>(ChannelService);
    const utilsService = declarations.get<UtilsService>(UtilsService);
    const ChannelList = declarations.get<FC<ChannelListProps>>(ChannelListComponent);
    const Popover = declarations.get<FC<PopoverProps>>(PopoverComponent);

    const internalChannelMap = {
        'pugio.web-terminal': WebTerminalAppComponent,
    };

    const LocaleContext = localeService.getContext();

    const theme = useTheme();
    const { client_id: clientId } = useParams();
    const locale = localeService.useContextLocale();
    const localeMap = localeService.useLocaleMap(locale);
    const buttonsWrapperRef = useRef<HTMLDivElement>(null);
    const [tabsScrollOffset, setTabsScrollOffset] = useState<number>(null);
    const debouncedTabsScrollOffset = useDebounce(tabsScrollOffset, { wait: 300 });
    const [tabTitleChangeCount, setTabTitleChangeCount] = useState<number>(0);
    const [buttonsWrapperSticked, setButtonsWrapperSticked] = useState<boolean>(false);
    const [buttonsWrapperWidth, setButtonsWrapperWidth] = useState<number>(120);
    const [placeholderWidth, setPlaceholderWidth] = useState<number>(0);
    const tabsWrapperRef = useRef<HTMLDivElement>(null);
    const placeholderRef = useRef<HTMLDivElement>(null);
    const tabsScrollRef = useRef<SimpleBar>(null);
    const {
        tabsScrollMap,
        setSelectedTab,
        updateTab,
        createTab,
        destroyTab,
        setTabsWrapperHeight,
        updateTabsScrollOffset,
    } = storeService.useStore((state) => {
        const {
            tabsScrollMap,
            setSelectedTab,
            updateTab,
            createTab,
            destroyTab,
            setTabsWrapperHeight,
            updateTabsScrollOffset,
        } = state;

        return {
            tabsScrollMap,
            setSelectedTab,
            updateTab,
            createTab,
            destroyTab,
            setTabsWrapperHeight,
            updateTabsScrollOffset,
        };
    }, shallow);
    const getLocaleText = localeService.useLocaleContext('pages.clientWorkstation');

    const handleLoadChannel = useCallback((channelId: string, clientId: string, tabId: string) => {
        console.log(111);
        // updateTab(clientId, tabId, {
        //     loading: true,
        // });

        Promise
            .all([
                channelService.getChannelInfo({ channelId }),
                clientService.getUserClientRelation({ clientId }),
            ])
            .then(([channelInfoResponse, getRelationResponse]) => {
                const data = channelInfoResponse.response;
                const relation = _.omit(getRelationResponse.response, ['user', 'client']);
                const user = getRelationResponse?.response.user;
                const client = getRelationResponse?.response.client;

                if (!(data && relation && user && client)) {
                    return Promise.reject(new Error());
                } else {
                    return {
                        data,
                        relation,
                        user,
                        client,
                    };
                }
            })
            .then((result) => {
                const {
                    data,
                    relation,
                    user,
                    client,
                } = result;

                const metadata = {
                    relation,
                    user,
                    client,
                } as ChannelMetadata;

                return new Promise<Partial<ChannelTab>>((resolve, reject) => {
                    const {
                        bundleUrl: url,
                        id: channelId,
                    } = data;

                    const channelEntryPromise = url === '<internal>'
                        ? Promise.resolve(declarations.get<FC<LoadedChannelProps>>(internalChannelMap[channelId]))
                        : utilsService.loadChannelBundle(url, channelId);

                    channelEntryPromise.then((ChannelEntry) => {
                        if (typeof ChannelEntry === 'function') {
                            resolve({
                                data,
                                nodes: (
                                    <ThemeProvider theme={theme}>
                                        <StyledEngineProvider injectFirst={true}>
                                            <LocaleContext.Provider
                                                value={{
                                                    locale,
                                                    localeTextMap: localeMap,
                                                }}
                                            >
                                                <Suspense fallback={null}>
                                                    <ChannelEntry
                                                        width={headerWidth}
                                                        height={panelHeight}
                                                        metadata={metadata}
                                                        locale={locale}
                                                        mode={theme.palette.mode}
                                                        setup={(lifecycle = {}) => {
                                                            updateTab(clientId, tabId, {
                                                                lifecycle,
                                                                loading: false,
                                                            });
                                                        }}
                                                        tab={{
                                                            closeTab: () => destroyTab(clientId, tabId),
                                                            createNewTab: (focus, channelId) => {
                                                                if (focus) {
                                                                    onCreateTab(clientId, { channelId });
                                                                } else {
                                                                    createTab(clientId, { channelId });
                                                                }
                                                            },
                                                            setTitle: (setterOrString) => {
                                                                let newTitle: string;
                                                                if (_.isString(setterOrString)) {
                                                                    newTitle = setterOrString;
                                                                } else if (_.isFunction(setterOrString)) {
                                                                    try {
                                                                        const tab = tabs.find((currentTab) => currentTab.tabId === tabId);
                                                                        newTitle = setterOrString(tab.title || tab.data.name);
                                                                    } catch (e) {}
                                                                }

                                                                if (newTitle) {
                                                                    updateTab(clientId, tabId, { title: newTitle });
                                                                }
                                                            },
                                                        }}
                                                    />
                                                </Suspense>
                                            </LocaleContext.Provider>
                                        </StyledEngineProvider>
                                    </ThemeProvider>
                                ),
                            });
                        } else {
                            reject(new Error());
                        }
                    }).catch((e) => {
                        reject(e);
                    });
                });
            })
            .then((result) => {
                updateTab(clientId, tabId, result);
            })
            .catch(() => {
                updateTab(clientId, tabId, {
                    errored: true,
                    loading: false,
                });
            });
    }, [tabs]);

    const tabsControlButtons = (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',

                '& > *': {
                    marginRight: theme.spacing(1),
                },
            }}
        >
            <Popover
                Trigger={({ open, openPopover }) => {
                    return (
                        <IconButton
                            sx={{
                                background: open
                                    ? theme.palette.mode === 'dark'
                                        ? theme.palette.grey[600]
                                        : theme.palette.grey[300]
                                    : 'transparent',
                            }}
                            onClick={openPopover}
                        ><Icon className="icon-plus" /></IconButton>
                    );
                }}
            >
                {
                    ({ closePopover }) => (
                        ChannelList
                            ? <ChannelList
                                clientId={clientId}
                                width={320}
                                height={360}
                                listItemProps={{
                                    mode: 'list-item',
                                    menu: [],
                                }}
                                searchProps={{
                                    InputProps: {
                                        startAdornment: <Icon className="icon-search" />,
                                        sx: {
                                            border: 0,
                                        },
                                    },
                                }}
                                headerProps={{
                                    style: {
                                        padding: 0,
                                    },
                                }}
                                headerSlot={
                                    <Box
                                        sx={{
                                            flexGrow: 1,
                                            flexShrink: 0,
                                            alignSelf: 'stretch',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: `0 ${theme.spacing(1)}`,
                                        }}
                                    >
                                        <IconButton
                                            title={getLocaleText('installChannel')}
                                        >
                                            <Icon className="icon icon-import" />
                                        </IconButton>
                                        <IconButton
                                            title={getLocaleText('createChannel')}
                                        >
                                            <Icon className="icon icon-plus" />
                                        </IconButton>
                                    </Box>
                                }
                                onSelectChannel={(channel) => {
                                    onCreateTab(clientId, { channelId: channel.id });
                                    closePopover();
                                }}
                            />
                            : null
                    )
                }
            </Popover>
            <IconButton>
                <Icon className="icon-more-horizontal" />
            </IconButton>
        </Box>
    );

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            const [observationData] = entries;

            if (observationData) {
                const blockSize = _.get(observationData, 'borderBoxSize[0].blockSize');

                if (_.isNumber(blockSize)) {
                    setTabsWrapperHeight(blockSize);
                }
            }
        });

        if (tabsWrapperRef.current) {
            observer.observe(tabsWrapperRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [tabsWrapperRef]);

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            const [observationData] = entries;

            if (observationData) {
                const inlineSize = _.get(observationData, 'borderBoxSize[0].inlineSize');

                if (_.isNumber(inlineSize)) {
                    setPlaceholderWidth(inlineSize);
                }
            }
        });

        if (placeholderRef.current) {
            observer.observe(placeholderRef.current);
        } else {
            setPlaceholderWidth(0);
        }

        return () => {
            observer.disconnect();
        };
    }, [placeholderRef.current]);

    useEffect(() => {
        setButtonsWrapperSticked(placeholderWidth === 0);
    }, [placeholderWidth]);

    useEffect(() => {
        if (tabsScrollRef.current) {
            const scrollElement = tabsScrollRef.current.getScrollElement();
            if (scrollElement) {
                const wheelEventHandler = (event: WheelEvent) => {
                    scrollElement.scrollTo(scrollElement.scrollLeft + event.deltaX + event.deltaY, 0);
                };

                scrollElement.addEventListener('wheel', wheelEventHandler);

                return () => {
                    scrollElement.removeEventListener('wheel', wheelEventHandler);
                };
            }
        }
    }, [tabsScrollRef.current]);

    useEffect(() => {
        if (tabsScrollRef.current) {
            const scrollElement = tabsScrollRef.current.getScrollElement();
            if (scrollElement) {
                const scrollEventHandler = () => {
                    setTabsScrollOffset(scrollElement.scrollLeft);
                };

                scrollElement.addEventListener('scroll', scrollEventHandler);

                return () => {
                    scrollElement.removeEventListener('scroll', scrollEventHandler);
                };
            }
        }
    }, [tabsScrollRef.current]);

    useEffect(() => {
        if (tabsScrollRef.current) {
            const scrollElement = tabsScrollRef.current.getScrollElement();

            if (scrollElement) {
                const tabsInitialScrollOffset = tabsScrollMap.get(clientId) || 0;
                scrollElement.scrollLeft = tabsInitialScrollOffset;
            }
        }
    }, [tabsScrollRef.current]);

    useEffect(() => {
        if (_.isNumber(debouncedTabsScrollOffset)) {
            updateTabsScrollOffset(clientId, debouncedTabsScrollOffset);
        }
    }, [debouncedTabsScrollOffset]);

    const scrollTabs = useCallback((offset: number) => {
        if (tabsScrollRef.current) {
            const scrollElement = tabsScrollRef.current.getScrollElement();

            if (scrollElement) {
                scrollElement.scrollLeft = offset;
            }
        }
    }, [tabsScrollRef.current]);

    useEffect(() => {
        if (buttonsWrapperRef.current) {
            setButtonsWrapperWidth(buttonsWrapperRef.current.clientWidth);
        }
    }, [buttonsWrapperRef.current]);

    return (
        <Box className="tabs" style={{ width: headerWidth }} ref={tabsWrapperRef}>
            {/* FIXME temporarily prevent flash popover */}
            <ChannelList />
            {
                (tabs.length > 0 && selectedTabId !== null) && (
                    <SimpleBar
                        className="tabs-wrapper"
                        autoHide={true}
                        style={{
                            maxWidth: headerWidth - (buttonsWrapperSticked ? buttonsWrapperWidth : 0),
                        }}
                        ref={tabsScrollRef}
                    >
                        {
                            _.isArray(tabs) && tabs.map((tab) => {
                                const {
                                    tabId,
                                    channelId,
                                    data,
                                    title,
                                    loading,
                                    errored,
                                    lifecycle = {},
                                    nodes,
                                } = tab;

                                return (
                                    <Tab
                                        key={tabId}
                                        loading={loading}
                                        errored={errored}
                                        channelId={channelId}
                                        title={title || data?.name}
                                        avatar={data?.avatar}
                                        active={selectedTabId === tabId}
                                        metadata={selectedTabMetadata}
                                        onClick={() => setSelectedTab(clientId, tabId)}
                                        onDataLoad={
                                            (channelId) => {
                                                if (!nodes) {
                                                    handleLoadChannel(channelId, clientId, tabId);
                                                }
                                            }
                                        }
                                        onClose={() => {
                                            if (typeof lifecycle.onBeforeDestroy === 'function' && !lifecycle.onBeforeDestroy()) {
                                                return;
                                            }

                                            destroyTab(clientId, tabId);
                                        }}
                                        onTitleChange={() => setTabTitleChangeCount(tabTitleChangeCount + 1)}
                                        onSelectedScroll={(offsetLeft, clientWidth) => {
                                            const scrollOffset = offsetLeft - (headerWidth - clientWidth) / 2;
                                            scrollTabs(scrollOffset <= 0 ? 0 : scrollOffset);
                                        }}
                                    />
                                );
                            })
                        }
                        {
                            !buttonsWrapperSticked && (
                                <Box
                                    ref={buttonsWrapperRef}
                                    className="buttons-wrapper floating"
                                >{tabsControlButtons}</Box>
                            )
                        }
                        <Box className="buttons-wrapper placeholder" ref={placeholderRef} />
                    </SimpleBar>
                )
            }
            {
                buttonsWrapperSticked && (
                    <Box
                        ref={buttonsWrapperRef}
                        className="buttons-wrapper"
                    >{tabsControlButtons}</Box>
                )
            }
            <Box
                sx={{
                    flexGrow: tabs.length > 0 ? 0 : 1,
                    flexShrink: 0,
                    display: 'flex',
                    justifyContent: tabs.length > 0 ? 'space-between' : 'flex-end',
                    alignItems: 'center',
                    paddingLeft: theme.spacing(1),
                    borderBottom: `1px solid ${theme.palette.divider}`,

                    '& > *': {
                        marginRight: `${theme.spacing(1)} !important`,
                    },
                }}
            >
                <Button
                    size="small"
                    classes={{ root: 'navigate-buttons' }}
                    startIcon={<Icon className="icon-home" />}
                    onClick={() => {
                        setSelectedTab(clientId, null);
                        onGoHome(selectedTabId);
                    }}
                >{getLocaleText('home')}</Button>
                <Button
                    size="small"
                    classes={{ root: 'navigate-buttons' }}
                    disabled={true}
                    startIcon={<Icon className="icon-import" />}
                >{getLocaleText('installChannel')}</Button>
                <Button
                    size="small"
                    classes={{ root: 'navigate-buttons' }}
                    disabled={true}
                    startIcon={<Icon className="icon-plus" />}
                >{getLocaleText('createChannel')}</Button>
            </Box>
        </Box>
    );
};

export default ClientWorkstationTabs;
