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
import { ChannelPopoverProps } from '@modules/channel/channel-popover.interface';
import { ChannelPopoverComponent } from '@modules/channel/channel-popover.component';

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

                    &.floating {
                        justify-content: flex-start;
                        padding-left: ${theme.spacing(1)};
                        border-left: 0;
                    }

                    &.placeholder {
                        flex-grow: 1;
                        min-width: 0;
                        border: 0;
                        border-bottom: 1px solid ${theme.palette.divider};
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

            .channel-not-selected {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
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

const ClientWorkstation: FC<InjectedComponentProps> = ({
    declarations,
}) => {
    const Tab = declarations.get<FC<TabProps>>(TabComponent);
    const ChannelPanel = declarations.get<FC<ChannelPanelProps>>(ChannelPanelComponent);
    const localeService = declarations.get<LocaleService>(LocaleService);
    const storeService = declarations.get<StoreService>(StoreService);
    const clientService = declarations.get<ClientService>(ClientService);
    const channelService = declarations.get<ChannelService>(ChannelService);
    const utilsService = declarations.get<UtilsService>(UtilsService);
    const Exception = declarations.get<FC<ExceptionProps>>(ExceptionComponent);
    const ChannelList = declarations.get<FC<ChannelListProps>>(ChannelListComponent);
    const ChannelPopover = declarations.get<FC<ChannelPopoverProps>>(ChannelPopoverComponent);

    const internalChannelMap = {
        'pugio.web-terminal': WebTerminalAppComponent,
    };
    const LocaleContext = localeService.getContext();

    const theme = useTheme();
    const { client_id: clientId } = useParams();
    const locale = localeService.useContextLocale();
    const localeMap = localeService.useLocaleMap(locale);
    const [tabsScrollOffset, setTabsScrollOffset] = useState<number>(null);
    const debouncedTabsScrollOffset = useDebounce(tabsScrollOffset, { wait: 300 });
    const [tabTitleChangeCount, setTabTitleChangeCount] = useState<number>(0);
    const [buttonsWrapperSticked, setButtonsWrapperSticked] = useState<boolean>(false);
    const [buttonsWrapperWidth] = useState<number>(70);
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

    const handleCreateTab = (clientId: string, data: TabData = {}) => {
        const tabId = createTab(clientId, data);
        setSelectedTab(clientId, `${tabId}:scroll`);
    };

    const handleSelectChannel = (clientId: string, tabId: string, channelId: string) => {
        updateTab(clientId, tabId, {
            channelId,
        });
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
        <>
            <ChannelPopover
                trigger={<IconButton><Icon className="icon-plus" /></IconButton>}
                channelListProps={
                    ({ handleClose }) => ({
                        clientId,
                        width: 320,
                        height: 360,
                        listItemProps: {
                            mode: 'list-item',
                            menu: [],
                        },
                        headerSlot: (
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
                        ),
                        onSelectChannel: (channel) => {
                            handleCreateTab(clientId, { channelId: channel.id });
                            handleClose();
                        },
                    })
                }
                popoverProps={{
                    PaperProps: {
                        sx: {
                            backgroundColor: theme.palette.mode === 'dark'
                                ? 'black'
                                : 'white',
                        },
                    },
                }}
            />
            <IconButton>
                <Icon className="icon-more-horizontal" />
            </IconButton>
        </>
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
        () => {
            if (window['__PUGIO_WORKSTATION_BUS__']) {
                window['__PUGIO_WORKSTATION_BUS__'].emit({
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
        const bus = utilsService.createEventBus();
        window['__PUGIO_WORKSTATION_BUS__'] = bus;
    }, []);

    return (
        clientOffline
            ? <ClientWorkstationWrapper className="page offline">
                <Exception
                    imageSrc="/static/images/error.svg"
                    title={getLocaleText('offline.title')}
                    subTitle={getLocaleText('offline.subTitle')}
                />
            </ClientWorkstationWrapper>
            : <ClientWorkstationWrapper className="page">
                {
                    clientTabsMap.get(clientId)?.size > 0 && (
                        <Box className="header-container">
                            <Box className="tabs" style={{ width: headerWidth }} ref={tabsWrapperRef}>
                                {
                                    _.isNumber(headerWidth) && (
                                        <SimpleBar
                                            className="tabs-wrapper"
                                            autoHide={true}
                                            style={{
                                                maxWidth: headerWidth - (buttonsWrapperSticked ? buttonsWrapperWidth : 0),
                                            }}
                                            ref={tabsScrollRef}
                                        >
                                            {
                                                _.isArray(tabs) && tabs.map((tab, index) => {
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
                                                            avatar={data?.avatar || '/static/images/channel_avatar_fallback.svg'}
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
                                                        className="buttons-wrapper floating"
                                                        style={{ width: buttonsWrapperWidth }}
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
                                            className="buttons-wrapper"
                                            style={{ width: buttonsWrapperWidth }}
                                        >{tabsControlButtons}</Box>
                                    )
                                }
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
                                imageSrc="/static/images/welcome.svg"
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
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Icon className="icon-plus" />}
                                    sx={{
                                        marginTop: '30px',
                                    }}
                                    onClick={() => handleCreateTab(clientId)}
                                >{getLocaleText('createTab')}</Button>
                            </Exception>
                        </Box>
                        : <SimpleBar
                            style={{
                                width: '100%',
                                height: panelHeight,
                            }}
                            className="panel-wrapper"
                        >
                            <ChannelPanel
                                tabId={selectedTabId}
                                channelTab={
                                    (clientTabsMap.get(clientId) || List<ChannelTab>([]))
                                        .find((channelTab) => channelTab.tabId === selectedTabId)
                                }
                            >
                                <Box className="channel-not-selected">
                                    <ChannelList
                                        clientId={clientId}
                                        width={headerWidth}
                                        height={panelHeight}
                                        headerSlot={
                                            <Box
                                                sx={{
                                                    flexGrow: 1,
                                                    flexShrink: 1,
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    paddingLeft: theme.spacing(1),
                                                }}
                                            >
                                                <Button
                                                    startIcon={<Icon className="icon-import" />}
                                                >{getLocaleText('installChannel')}</Button>
                                                <Button
                                                    startIcon={<Icon className="icon-plus" />}
                                                >{getLocaleText('createChannel')}</Button>
                                            </Box>
                                        }
                                        onSelectChannel={(channel) => {
                                            handleSelectChannel(clientId, selectedTabId, channel.id);
                                        }}
                                    />
                                </Box>
                            </ChannelPanel>
                        </SimpleBar>
                }
            </ClientWorkstationWrapper>
    );
};

export default ClientWorkstation;
