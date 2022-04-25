/* eslint-disable no-unused-vars */
import {
    createElement,
    FC,
    useEffect,
    useRef,
    useState,
    useCallback,
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
import { StyledEngineProvider } from '@mui/material/styles';
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
import {
    useDebounce,
    useRequest,
} from 'ahooks';
import { ExceptionProps } from '@modules/brand/exception.interface';
import { ExceptionComponent } from '@modules/brand/exception.component';
import { AppComponent as WebTerminalAppComponent } from '@builtin:web-terminal/app.component';
import { ChannelListComponent } from '@modules/client/channel-list.component';
import { ChannelListProps } from '@modules/client/channel-list.interface';
import '@modules/client/client-workstation.component.less';
import { BrandService } from '@modules/brand/brand.service';

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
    const brandService = declarations.get<BrandService>(BrandService);
    const Exception = declarations.get<FC<ExceptionProps>>(ExceptionComponent);
    const ChannelList = declarations.get<FC<ChannelListProps>>(ChannelListComponent);

    const internalChannelMap = {
        'pugio.web-terminal': WebTerminalAppComponent,
    };
    const theme = brandService.getTheme();
    const LocaleContext = localeService.getContext();

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
    const [windowInnerWidth, setWindowInnerWidth] = useState<number>(window.innerWidth);
    const [windowInnerHeight, setWindowInnerHeight] = useState<number>(window.innerHeight);
    const {
        sidebarWidth,
        appNavbarHeight,
        controlsWrapperHeight,
        tabsWrapperHeight,
        clientTabsMap,
        selectedTabMap,
        tabsScrollMap,
        setSelectedTab,
        updateTab,
        createTab,
        destroyTab,
        setTabsWrapperHeight,
        updateTabsScrollOffset,
    } = storeService.useStore((state) => {
        const {
            appNavbarHeight,
            controlsWrapperHeight,
            tabsWrapperHeight,
            clientSidebarWidth: sidebarWidth,
            channelTabs: clientTabsMap,
            selectedTabMap,
            tabsScrollMap,

            setSelectedTab,
            updateTab,
            createTab,
            destroyTab,
            setTabsWrapperHeight,
            updateTabsScrollOffset,
        } = state;

        return {
            appNavbarHeight,
            controlsWrapperHeight,
            tabsWrapperHeight,
            sidebarWidth,
            clientTabsMap,
            selectedTabMap,
            tabsScrollMap,

            setSelectedTab,
            updateTab,
            createTab,
            destroyTab,
            setTabsWrapperHeight,
            updateTabsScrollOffset,
        };
    }, shallow);
    const getLocaleText = localeService.useLocaleContext('pages.client_workstation');
    const [selectedTabId, setSelectedTabId] = useState<string>(null);
    const [selectedTabMetadata, setSelectedTabMetadata] = useState<string[]>([]);
    const {
        loading: getClientInformationLoading,
        data: getClientInformationResponseData,
    } = useRequest(
        clientService.getClientInformation.bind(clientService) as typeof clientService.getClientInformation,
    );

    const handleCreateTab = (clientId: string, data: TabData = {}) => {
        const tabId = createTab(clientId, data);
        setSelectedTab(clientId, `${tabId}:scroll`);
    };

    const handleSelectChannel = (clientId: string, tabId: string, channelId: string) => {
        updateTab(clientId, tabId, {
            channelId,
        });
    };

    const handleLoadChannel = (channelId: string, clientId: string, tabId: string) => {
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
                                nodes: createElement(
                                    ThemeProvider,
                                    { theme },
                                    <StyledEngineProvider injectFirst={true}>
                                        <LocaleContext.Provider
                                            value={{
                                                locale,
                                                localeTextMap: localeMap,
                                            }}
                                        >
                                            <ChannelEntry
                                                width={headerWidth}
                                                height={panelHeight}
                                                metadata={metadata}
                                                basename={`/client/${clientId}/workstation`}
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
                                                }}
                                            />
                                        </LocaleContext.Provider>
                                    </StyledEngineProvider>,
                                ),
                            });
                        } else {
                            reject(new Error());
                        }
                    }).catch((e) => reject(e));
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
    };

    const tabsControlButtons = (
        <>
            <IconButton
                onClick={() => {
                    handleCreateTab(clientId);
                }}
            >
                <Icon className="icon-plus" />
            </IconButton>
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
        const handler = () => {
            setWindowInnerWidth(window.innerWidth);
            setWindowInnerHeight(window.innerHeight);
        };

        window.addEventListener('resize', handler);

        return () => {
            window.removeEventListener('resize', handler);
        };
    }, []);

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
        if (appNavbarHeight && controlsWrapperHeight && windowInnerHeight) {
            setPanelHeight(windowInnerHeight - appNavbarHeight * 2 - controlsWrapperHeight - tabsWrapperHeight);
        }
    }, [
        appNavbarHeight,
        controlsWrapperHeight,
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

    return (
        <Box className="page client-workstation-page">
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
                                                    loading,
                                                    errored,
                                                    lifecycle = {},
                                                    nodes,
                                                } = tab;

                                                return createElement(
                                                    Tab,
                                                    {
                                                        key: tabId,
                                                        loading,
                                                        errored,
                                                        channelId,
                                                        title: data?.name,
                                                        avatar: data?.avatar || '/static/images/channel_avatar_fallback.svg',
                                                        active: selectedTabId === tabId,
                                                        metadata: selectedTabMetadata,
                                                        onClick: () => setSelectedTab(clientId, tabId),
                                                        onDataLoad: (channelId) => {
                                                            if (!nodes) {
                                                                handleLoadChannel(channelId, clientId, tabId);
                                                            }
                                                        },
                                                        onClose: () => {
                                                            if (
                                                                typeof lifecycle.onBeforeDestroy === 'function' &&
                                                                !lifecycle.onBeforeDestroy()
                                                            ) {
                                                                return;
                                                            }

                                                            destroyTab(clientId, tabId);
                                                        },
                                                        onTitleChange: () => setTabTitleChangeCount(tabTitleChangeCount + 1),
                                                        onSelectedScroll: (offsetLeft, clientWidth) => {
                                                            const scrollOffset = offsetLeft - (headerWidth - clientWidth) / 2;
                                                            scrollTabs(scrollOffset <= 0 ? 0 : scrollOffset);
                                                        },
                                                    },
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
                            className="welcome"
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<Icon className="icon-plus" />}
                                onClick={() => handleCreateTab(clientId)}
                            >Create a Tab</Button>
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
                                    tabId={selectedTabId}
                                    clientId={clientId}
                                    width={headerWidth}
                                    height={panelHeight}
                                    onSelectChannel={(channelId) => {
                                        handleSelectChannel(clientId, selectedTabId, channelId);
                                    }}
                                />
                            </Box>
                        </ChannelPanel>
                    </SimpleBar>
            }
        </Box>
    );
};

export default ClientWorkstation;
