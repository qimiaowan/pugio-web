import {
    createElement,
    FC,
    useEffect,
    useRef,
    useState,
} from 'react';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import { InjectedComponentProps } from 'khamsa';
import { TabProps } from '@modules/tab/tab.interface';
import { TabComponent } from '@modules/tab/tab.component';
import { ChannelPanelComponent } from '@modules/channel/channel-panel.component';
import { ChannelPanelProps } from '@modules/channel/channel.interface';
import { LocaleService } from '@modules/locale/locale.service';
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
    const localeService = declarations.get<LocaleService>(LocaleService);
    const storeService = declarations.get<StoreService>(StoreService);
    const clientService = declarations.get<ClientService>(ClientService);
    const channelService = declarations.get<ChannelService>(ChannelService);
    const utilsService = declarations.get<UtilsService>(UtilsService);

    const { client_id: clientId } = useParams();
    const location = useLocation();
    const tabsWrapperRef = useRef<HTMLDivElement>(null);
    const [headerWidth, setHeaderWidth] = useState<number>(null);
    const [panelHeight, setPanelHeight] = useState<number>(null);
    const [tabs, setTabs] = useState<ChannelTab[]>([]);
    const [windowInnerWidth, setWindowInnerWidth] = useState<number>(window.innerWidth);
    const [windowInnerHeight, setWindowInnerHeight] = useState<number>(window.innerHeight);
    const [startupTabSelected, setStartupTabSelected] = useState<boolean>(true);
    const {
        sidebarWidth,
        appNavbarHeight,
        controlsWrapperHeight,
        tabsWrapperHeight,
        setSelectedTab,
        updateTab,
        createTab,
        destroyTab,
    } = storeService.useStore((state) => {
        const {
            appNavbarHeight,
            controlsWrapperHeight,
            tabsWrapperHeight,
            clientSidebarWidth: sidebarWidth,
            setSelectedTab,
            updateTab,
            createTab,
            destroyTab,
        } = state;

        return {
            appNavbarHeight,
            controlsWrapperHeight,
            tabsWrapperHeight,
            sidebarWidth,
            setSelectedTab,
            updateTab,
            createTab,
            destroyTab,
        };
    }, shallow);
    const setTabsWrapperHeight = storeService.useStore((state) => state.setTabsWrapperHeight);
    const clientTabsMap = storeService.useStore((state) => state.channelTabs);
    const selectedTabMap = storeService.useStore((state) => state.selectedTabMap);
    const getLocaleText = localeService.useLocaleContext('pages.client_workstation');

    const handleCreateTab = (clientId: string, channelId: string) => {
        const tabId = createTab(clientId, {
            channelId,
        });
        setSelectedTab(clientId, tabId);
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
            observer.unobserve(tabsWrapperRef.current);
        };
    }, [tabsWrapperRef]);

    useEffect(() => {
        if (appNavbarHeight && controlsWrapperHeight && tabsWrapperHeight && windowInnerHeight) {
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
        if (selectedTabMap) {
            setStartupTabSelected(
                selectedTabMap.get(clientId) === '@@startup' ||
                !selectedTabMap.get(clientId),
            );
        }
    }, [selectedTabMap]);

    return (
        <Box className="page client-workstation-page">
            <Box className="header-container">
                <Box className="tabs" style={{ width: headerWidth }} ref={tabsWrapperRef}>
                    {
                        _.isNumber(headerWidth) && (
                            <SimpleBar
                                className="tabs-wrapper"
                                autoHide={true}
                                style={{ maxWidth: headerWidth - 60 }}
                            >
                                <Tab
                                    startup={true}
                                    closable={false}
                                    avatar="/static/images/all_channels.svg"
                                    title={getLocaleText('all_channels')}
                                    active={startupTabSelected}
                                    onClick={() => setSelectedTab(clientId, '@@startup')}
                                />
                                {
                                    _.isArray(tabs) && tabs.map((tab, index) => {
                                        const {
                                            tabId,
                                            channelId,
                                            data,
                                            loading,
                                            errored,
                                            lifecycle = {},
                                        } = tab;

                                        return createElement(
                                            Tab,
                                            {
                                                key: index,
                                                loading,
                                                errored,
                                                title: data?.name,
                                                avatar: data?.avatar || '/static/images/channel_avatar_fallback.svg',
                                                active: selectedTabMap.get(clientId) === tabId,
                                                onClick: () => setSelectedTab(clientId, tabId),
                                                onDataLoad: () => {
                                                    handleLoadChannel(channelId, clientId, tabId);
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
                                            },
                                        );
                                    })
                                }
                                <Tab slotElement={true} />
                            </SimpleBar>
                        )
                    }
                    <Box className="buttons-wrapper">
                        <IconButton
                            onClick={() => {
                                setSelectedTab(clientId, '@@startup');
                            }}
                        >
                            <Icon className="icon-plus" />
                        </IconButton>
                        <IconButton>
                            <Icon className="icon-more-horizontal" />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
            <SimpleBar
                style={{
                    width: '100%',
                    height: panelHeight,
                }}
                className="panel-wrapper"
            >
                <ChannelPanel
                    startupTab={startupTabSelected}
                    tabId={selectedTabMap.get(clientId)}
                    {
                        ...(clientTabsMap.get(clientId) || Set<ChannelTab>([]))
                            .find((channelTab) => channelTab.tabId === selectedTabMap.get(clientId))
                    }
                >
                    {
                        startupTabSelected
                            ? <>
                                <button
                                    onClick={() => handleCreateTab(clientId, 'pugio.pipelines')}
                                >test</button>
                            </>
                            : null
                    }
                </ChannelPanel>
            </SimpleBar>
        </Box>
    );
};

export default ClientWorkstation;
