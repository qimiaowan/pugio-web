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
import { getContainer } from 'khamsa';
import { TabProps } from '@modules/tab/tab.interface';
import { TabComponent } from '@modules/tab/tab.component';
import { ChannelPanelComponent } from '@modules/channel/channel-panel.component';
import { ChannelPanelProps } from '@modules/channel/channel.interface';
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
import { ExceptionProps } from '@modules/brand/exception.interface';
import { ExceptionComponent } from '@modules/brand/exception.component';
import { AppComponent as WebTerminalAppComponent } from '@builtin:web-terminal/app.component';
import { ChannelListComponent } from '@modules/channel/channel-list.component';
import { ChannelListProps } from '@modules/channel/channel-list.interface';
import styled from '@mui/material/styles/styled';
import { PopoverProps } from '@modules/common/popover.interface';
import { PopoverComponent } from '@modules/common/popover.component';
import Color from 'color';
import { ConfigService } from '@modules/config/config.service';

const ClientWorkstationWrapper = styled(Box)(({ theme }) => {
    const mode = theme.palette.mode;

    return `
        position: relative;

        &.offline {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .header-container {
            background-color: ${mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50]};
            border-top: 1px solid ${theme.palette.divider};

            .tabs {
                display: flex;

                .tabs-wrapper {
                    flex-grow: 1;
                    flex-shrink: 1;

                    .simplebar-content {
                        display: flex;
                        align-items: stretch;
                        flex-grow: 1;
                        display: flex;
                    }
                }

                .buttons-wrapper {
                    box-sizing: border-box;
                    flex-grow: 0;
                    flex-shrink: 1;
                    border-bottom: 1px solid ${theme.palette.divider};
                    border-left: 1px solid ${theme.palette.divider};
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding-left: ${theme.spacing(1)};

                    &.floating {
                        justify-content: flex-start;
                        border-left: 0;
                    }

                    &.placeholder {
                        flex-grow: 1;
                        min-width: 0;
                        border: 0;
                        border-bottom: 1px solid ${theme.palette.divider};
                        padding-left: 0;
                    }
                }

                .tabs-cursor {
                    width: 0;
                }
            }
        }

        .panel-wrapper {
            .simplebar-content {
                height: 100%;
                display: flex;
                flex-direction: column;
            }
        }

        .empty-tabs {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            .exception.welcome {
                img {
                    width: 120px;
                    height: 120px;
                }

                .title {
                    margin-top: 50px;
                    font-size: 18px;
                }

                .subtitle {
                    margin-top: 15px;
                    margin-bottom: 50px;
                }
            }
        }
    `;
});

const ClientWorkstation: FC = () => {
    const container = getContainer(ClientWorkstation);
    const Tab = container.get<FC<TabProps>>(TabComponent);
    const ChannelPanel = container.get<FC<ChannelPanelProps>>(ChannelPanelComponent);
    const localeService = container.get<LocaleService>(LocaleService);
    const storeService = container.get<StoreService>(StoreService);
    const clientService = container.get<ClientService>(ClientService);
    const channelService = container.get<ChannelService>(ChannelService);
    const utilsService = container.get<UtilsService>(UtilsService);
    const Exception = container.get<FC<ExceptionProps>>(ExceptionComponent);
    const ChannelList = container.get<FC<ChannelListProps>>(ChannelListComponent);
    const configService = container.get<ConfigService>(ConfigService);
    const Popover = container.get<FC<PopoverProps>>(PopoverComponent);

    const internalChannelMap = {
        'pugio.web-terminal': WebTerminalAppComponent,
    };
    const LocaleContext = localeService.getContext();

    const theme = useTheme();
    const { client_id: clientId } = useParams();
    const locale = localeService.useContextLocale();
    const buttonsWrapperRef = useRef<HTMLDivElement>(null);
    const startupWrapperRef = useRef<HTMLDivElement>(null);
    const [tabsScrollOffset, setTabsScrollOffset] = useState<number>(null);
    const debouncedTabsScrollOffset = useDebounce(tabsScrollOffset, { wait: 300 });
    const [tabTitleChangeCount, setTabTitleChangeCount] = useState<number>(0);
    const [buttonsWrapperSticked, setButtonsWrapperSticked] = useState<boolean>(false);
    const [buttonsWrapperWidth, setButtonsWrapperWidth] = useState<number>(120);
    const [startupWrapperWidth, setStartupWrapperWidth] = useState<number>(0);
    const [placeholderWidth, setPlaceholderWidth] = useState<number>(0);
    const tabsWrapperRef = useRef<HTMLDivElement>(null);
    const placeholderRef = useRef<HTMLDivElement>(null);
    const tabsScrollRef = useRef<SimpleBar>(null);
    const [headerWidth, setHeaderWidth] = useState<number>(null);
    const [panelHeight, setPanelHeight] = useState<number>(null);
    const [tabs, setTabs] = useState<ChannelTab[]>([]);
    const {
        sidebarWidth,
        appNavbarHeight,
        tabsWrapperHeight,
        clientTabsMap,
        selectedTabMap,
        tabsScrollMap,
        windowInnerHeight,
        windowInnerWidth,
        setSelectedTab,
        updateTab,
        createTab,
        destroyTab,
        setTabsWrapperHeight,
        updateTabsScrollOffset,
    } = storeService.useStore((state) => {
        const {
            appNavbarHeight,
            tabsWrapperHeight,
            clientSidebarWidth: sidebarWidth,
            channelTabs: clientTabsMap,
            selectedTabMap,
            tabsScrollMap,
            windowInnerHeight,
            windowInnerWidth,
            setSelectedTab,
            updateTab,
            createTab,
            destroyTab,
            setTabsWrapperHeight,
            updateTabsScrollOffset,
        } = state;

        return {
            appNavbarHeight,
            tabsWrapperHeight,
            sidebarWidth,
            clientTabsMap,
            selectedTabMap,
            tabsScrollMap,
            windowInnerHeight,
            windowInnerWidth,
            setSelectedTab,
            updateTab,
            createTab,
            destroyTab,
            setTabsWrapperHeight,
            updateTabsScrollOffset,
        };
    }, shallow);
    const getLocaleText = localeService.useLocaleContext('pages.clientWorkstation');
    const [selectedTabId, setSelectedTabId] = useState<string>(null);
    const [selectedTabMetadata, setSelectedTabMetadata] = useState<string[]>([]);
    const [clientOffline, setClientOffline] = useState<boolean>(false);
    const [lastSelectedTabId, setLastSelectedTabId] = useState<string>(null);

    const handleEmitConfig = useCallback(
        () => {
            if (window[configService.WORKSTATION_BUS_ID]) {
                window[configService.WORKSTATION_BUS_ID].emit({
                    width: headerWidth,
                    height: panelHeight,
                    locale,
                    mode: theme.palette.mode,
                });
            }
        },
        [
            locale,
            theme.palette.mode,
            panelHeight,
            headerWidth,
        ],
    );

    useEffect(() => {
        console.log('locale change', locale);
    }, [locale]);

    const handleCreateTab = (clientId: string, data: TabData = {}) => {
        const tabId = createTab(clientId, data);
        setSelectedTab(clientId, `${tabId}:scroll`);
    };

    const handleLoadChannel = useCallback((channelId: string, clientId: string, tabId: string) => {
        updateTab(clientId, tabId, {
            loading: true,
        });

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
                        localeMap: rawTranslationMap,
                    } = data;

                    const channelEntryPromise = url === '<internal>'
                        ? Promise.resolve(container.get<FC<LoadedChannelProps>>(internalChannelMap[channelId]))
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
                                                    localeTextMap: localeService.parseChannelTranslationMap(rawTranslationMap),
                                                }}
                                            >
                                                <Suspense fallback={null}>
                                                    <ChannelEntry
                                                        metadata={metadata}
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
                                                                    handleCreateTab(clientId, { channelId });
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
                                                        useChannelConfig={utilsService.useChannelConfig.bind(utilsService)}
                                                        useLocaleContext={localeService.useChannelLocaleContext.bind(localeService)}
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
                                onSelectChannel={(channel) => {
                                    handleCreateTab(clientId, { channelId: channel.id });
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
        if (_.isNumber(sidebarWidth) && _.isNumber(windowInnerWidth)) {
            setHeaderWidth(windowInnerWidth - sidebarWidth);
        }
    }, [sidebarWidth, windowInnerWidth]);

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
        if (appNavbarHeight && windowInnerHeight) {
            setPanelHeight(windowInnerHeight - appNavbarHeight * 2 - tabsWrapperHeight + 3);
        }
    }, [
        appNavbarHeight,
        tabsWrapperHeight,
        windowInnerHeight,
    ]);

    useEffect(() => {
        if (clientId && clientTabsMap) {
            const currentClientTabs = (clientTabsMap.get(clientId) || List<ChannelTab>([])).toArray();
            setTabs(currentClientTabs);
        }
    }, [clientId, clientTabsMap]);

    useEffect(() => {
        if (selectedTabMap && clientId) {
            const selectedTabLiteral = selectedTabMap.get(clientId);

            if (_.isString(selectedTabLiteral)) {
                const {
                    tabId,
                    metadata,
                } = utilsService.parseSelectedTabId(selectedTabLiteral);

                setSelectedTabId(tabId);
                setSelectedTabMetadata(metadata);
            } else {
                setSelectedTabId(null);
                setSelectedTabMetadata([]);
            }
        }
    }, [selectedTabMap, clientId]);

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
        const intervalId = setInterval(() => {
            clientService.getClientCurrentStatus({ clientId }).then((response) => {
                setClientOffline(response?.response?.offline);
            });
        }, 30000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    useEffect(
        handleEmitConfig,
        [
            locale,
            theme.palette.mode,
            panelHeight,
            headerWidth,
        ],
    );

    useEffect(() => {
        const bus = utilsService.createEventBus();
        window[configService.WORKSTATION_BUS_ID] = bus;
    }, []);

    useEffect(() => {
        if (buttonsWrapperRef.current) {
            setButtonsWrapperWidth(buttonsWrapperRef.current.clientWidth);
        }

        if (startupWrapperRef.current) {
            setStartupWrapperWidth(startupWrapperRef.current.clientWidth);
        }
    }, [
        buttonsWrapperRef.current,
        startupWrapperRef.current,
    ]);

    return (
        clientOffline
            ? <ClientWorkstationWrapper className="page offline">
                <Exception
                    type="error"
                    title={getLocaleText('offline.title')}
                    subTitle={getLocaleText('offline.subTitle')}
                />
            </ClientWorkstationWrapper>
            : <ClientWorkstationWrapper className="page">
                {
                    selectedTabId && (
                        <Box className="header-container">
                            <Box className="tabs" style={{ width: headerWidth }} ref={tabsWrapperRef}>
                                {
                                    (clientTabsMap.get(clientId)?.size > 0 && selectedTabId !== null) && (
                                        <SimpleBar
                                            className="tabs-wrapper"
                                            autoHide={true}
                                            style={{
                                                maxWidth: headerWidth - (buttonsWrapperSticked ? buttonsWrapperWidth : 0) - startupWrapperWidth,
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
                                                                        handleEmitConfig();
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
                                        flexGrow: clientTabsMap.get(clientId)?.size > 0 ? 0 : 1,
                                        flexShrink: 0,
                                        display: 'flex',
                                        justifyContent: clientTabsMap.get(clientId)?.size > 0 ? 'space-between' : 'flex-end',
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
                                            setLastSelectedTabId(selectedTabId);
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
                        </Box>
                    )
                }
                {
                    !selectedTabId
                        ? <Box
                            className="empty-tabs"
                            style={{ width: headerWidth, height: panelHeight }}
                        >
                            <Exception
                                type="welcome"
                                title={getLocaleText('welcome.title')}
                                subTitle={getLocaleText('welcome.subTitle')}
                                sx={{
                                    '.title': {
                                        fontSize: 18,
                                    },
                                    'img': {
                                        width: 120,
                                        height: 120,
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '100%',
                                        marginTop: 4,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',

                                        '& button': {
                                            margin: `0 ${theme.spacing(0.5)}`,
                                        },
                                    }}
                                >
                                    {
                                        lastSelectedTabId && (
                                            <Button
                                                variant="text"
                                                color="primary"
                                                size="small"
                                                startIcon={<Icon className="icon-return" />}
                                                onClick={() => {
                                                    setSelectedTab(clientId, lastSelectedTabId);
                                                    setLastSelectedTabId(null);
                                                }}
                                            >{getLocaleText('goBack')}</Button>
                                        )
                                    }
                                    <Popover
                                        Trigger={({ open, openPopover }) => {
                                            return (
                                                <Button
                                                    variant="text"
                                                    color="primary"
                                                    size="small"
                                                    startIcon={<Icon className="icon-plus" />}
                                                    sx={{
                                                        ...(open ? {
                                                            backgroundColor: Color(theme.palette.primary.main).alpha(0.2).toString(),
                                                        } : {}),
                                                    }}
                                                    onClick={openPopover}
                                                >{getLocaleText('createTab')}</Button>
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
                                                        onSelectChannel={(channel) => {
                                                            handleCreateTab(clientId, { channelId: channel.id });
                                                            closePopover();
                                                        }}
                                                    />
                                                    : null
                                            )
                                        }
                                    </Popover>
                                </Box>
                            </Exception>
                        </Box>
                        : <>
                            {
                                selectedTabId && (
                                    <SimpleBar
                                        style={{
                                            width: '100%',
                                            height: panelHeight,
                                        }}
                                        className="panel-wrapper"
                                    >
                                        <ChannelPanel
                                            tabId={selectedTabId}
                                            channelTab={(clientTabsMap.get(clientId) || List<ChannelTab>([])).find((tab) => tab.tabId === selectedTabId)}
                                        />
                                    </SimpleBar>
                                )
                            }
                        </>
                }
            </ClientWorkstationWrapper>
    );
};

export default ClientWorkstation;
