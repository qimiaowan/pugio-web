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
import { InjectedComponentProps } from 'khamsa';
import { TabProps } from '@modules/tab/tab.interface';
import { TabComponent } from '@modules/tab/tab.component';
import { ChannelPanelComponent } from '@modules/channel/channel-panel.component';
import { ChannelPanelProps } from '@modules/channel/channel.interface';
// import { LocaleService } from '@modules/locale/locale.service';
import { StoreService } from '@modules/store/store.service';
import _ from 'lodash';
import shallow from 'zustand/shallow';
import SimpleBar from 'simplebar-react';
import {
    ChannelTab,
    ChannelMetadata,
} from '@modules/store/store.interface';
import { ClientService } from '@modules/client/client.service';
import { ChannelService } from '@modules/channel/channel.service';
import { UtilsService } from '@modules/utils/utils.service';
import {
    useParams,
    useLocation,
} from 'react-router-dom';
import { Set } from 'immutable';
import '@modules/client/client-workstation.component.less';

const ClientWorkstation: FC<InjectedComponentProps> = ({
    declarations,
}) => {
    const Tab = declarations.get<FC<TabProps>>(TabComponent);
    const ChannelPanel = declarations.get<FC<ChannelPanelProps>>(ChannelPanelComponent);
    // const localeService = declarations.get<LocaleService>(LocaleService);
    const storeService = declarations.get<StoreService>(StoreService);
    const clientService = declarations.get<ClientService>(ClientService);
    const channelService = declarations.get<ChannelService>(ChannelService);
    const utilsService = declarations.get<UtilsService>(UtilsService);

    const { client_id: clientId } = useParams();
    const location = useLocation();
    const [tabTitleChangeCount, setTabTitleChangeCount] = useState<number>(0);
    const [buttonsWrapperSticked, setButtonsWrapperSticked] = useState<boolean>(false);
    const [buttonsWrapperWidth] = useState<number>(70);
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
        setSelectedTab,
        updateTab,
        createTab,
        destroyTab,
        setTabsWrapperHeight,
    } = storeService.useStore((state) => {
        const {
            appNavbarHeight,
            controlsWrapperHeight,
            tabsWrapperHeight,
            clientSidebarWidth: sidebarWidth,
            channelTabs: clientTabsMap,
            selectedTabMap,
            setSelectedTab,
            updateTab,
            createTab,
            destroyTab,
            setTabsWrapperHeight,
        } = state;

        return {
            appNavbarHeight,
            controlsWrapperHeight,
            tabsWrapperHeight,
            sidebarWidth,
            clientTabsMap,
            selectedTabMap,
            setSelectedTab,
            updateTab,
            createTab,
            destroyTab,
            setTabsWrapperHeight,
        };
    }, shallow);
    // const getLocaleText = localeService.useLocaleContext('pages.client_workstation');
    const [selectedTabId, setSelectedTabId] = useState<string>(null);
    const forceSetSticked = useCallback((state) => setButtonsWrapperSticked(state), [
        placeholderRef,
        selectedTabId,
        clientId,
        clientTabsMap,
        buttonsWrapperWidth,
        headerWidth,
        tabTitleChangeCount,
    ]);

    const handleCreateTab = (clientId: string) => {
        const tabId = createTab(clientId);
        setSelectedTab(clientId, tabId);
    };

    const testHandleSelectChannel = (clientId: string, tabId: string, channelId: string) => {
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
                        location,
                    };
                }
            })
            .then((result) => {
                const {
                    data,
                    relation,
                    user,
                    client,
                    location,
                } = result;

                const metadata = {
                    relation,
                    user,
                    client,
                    location,
                } as ChannelMetadata;

                return new Promise<Partial<ChannelTab>>((resolve, reject) => {
                    const {
                        bundleUrl: url,
                        id: channelId,
                    } = data;
                    utilsService.loadChannelBundle(url, channelId)
                        .then((ChannelEntry) => {
                            if (typeof ChannelEntry === 'function') {
                                resolve({
                                    data,
                                    nodes: createElement(
                                        ChannelEntry,
                                        {
                                            width: headerWidth,
                                            height: panelHeight,
                                            metadata: metadata,
                                            onChannelLoad: (lifecycle) => {
                                                updateTab(clientId, tabId, {
                                                    lifecycle,
                                                });
                                            },
                                        },
                                    ),
                                });
                            } else {
                                reject(new Error());
                            }
                        })
                        .catch((e) => reject(e));
                });
            })
            .then((result) => {
                updateTab(clientId, tabId, result);
            })
            .catch(() => {
                updateTab(clientId, tabId, {
                    errored: true,
                });
            })
            .finally(() => {
                updateTab(clientId, tabId, {
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
        if (appNavbarHeight && controlsWrapperHeight && windowInnerHeight) {
            setPanelHeight(windowInnerHeight - appNavbarHeight - controlsWrapperHeight - tabsWrapperHeight);
        }
    }, [
        appNavbarHeight,
        controlsWrapperHeight,
        tabsWrapperHeight,
        windowInnerHeight,
    ]);

    useEffect(() => {
        if (clientId && clientTabsMap) {
            const currentClientTabs = (clientTabsMap.get(clientId) || Set<ChannelTab>([])).toArray();
            setTabs(currentClientTabs);
        }
    }, [clientId, clientTabsMap]);

    useEffect(() => {
        if (selectedTabMap && clientId) {
            setSelectedTabId(selectedTabMap.get(clientId));
        }
    }, [selectedTabMap, clientId]);

    useEffect(() => {
        if (placeholderRef.current) {
            const width = placeholderRef.current.clientWidth;
            setTimeout(() => forceSetSticked(width === 0), 0);
        }
    }, [
        placeholderRef,
        selectedTabId,
        clientId,
        clientTabsMap,
        buttonsWrapperWidth,
        headerWidth,
        tabTitleChangeCount,
    ]);

    const scrollTabs = useCallback((offset: number) => {
        if (tabsScrollRef.current) {
            tabsScrollRef.current.getScrollElement().scrollLeft = offset;
        }
    }, [tabsScrollRef]);

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
                                                        key: index,
                                                        loading,
                                                        errored,
                                                        channelId,
                                                        title: data?.name,
                                                        avatar: data?.avatar || '/static/images/channel_avatar_fallback.svg',
                                                        active: selectedTabId === tabId,
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
                                                        onSelected: (offsetLeft, clientWidth) => {
                                                            console.log(offsetLeft, clientWidth);
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
                        <button
                            onClick={() => {
                                handleCreateTab(clientId);
                            }}
                        >test create tab</button>
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
                                (clientTabsMap.get(clientId) || Set<ChannelTab>([]))
                                    .find((channelTab) => channelTab.tabId === selectedTabId)
                            }
                        >
                            <Box className="channel-not-selected">
                                <button
                                    onClick={() => {
                                        testHandleSelectChannel(clientId, selectedTabId, 'pugio.pipelines');
                                    }}
                                >test select channel</button>
                                <button
                                    onClick={() => {
                                        const offset = Math.random() * 100;
                                        scrollTabs(offset);
                                    }}
                                >scroll</button>
                            </Box>
                        </ChannelPanel>
                    </SimpleBar>
            }
        </Box>
    );
};

export default ClientWorkstation;
