import {
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
import { ChannelTab } from '@modules/store/store.interface';
import { useParams } from 'react-router-dom';
import { Set } from 'immutable';
import '@modules/client/client-workstation.component.less';

const ClientWorkstation: FC<InjectedComponentProps> = ({
    declarations,
}) => {
    const Tab = declarations.get<FC<TabProps>>(TabComponent);
    const ChannelPanel = declarations.get<FC<ChannelPanelProps>>(ChannelPanelComponent);
    const localeService = declarations.get<LocaleService>(LocaleService);
    const storeService = declarations.get<StoreService>(StoreService);

    const { client_id: clientId } = useParams();
    const tabsWrapperRef = useRef<HTMLDivElement>(null);
    const [headerWidth, setHeaderWidth] = useState<number>(null);
    const [panelHeight, setPanelHeight] = useState<number>(null);
    const [tabs, setTabs] = useState<ChannelTab[]>([]);
    const [windowInnerWidth, setWindowInnerWidth] = useState<number>(window.innerWidth);
    const [windowInnerHeight, setWindowInnerHeight] = useState<number>(window.innerHeight);
    const [startupTabSelected, setStartupTabSelected] = useState<boolean>(false);
    const {
        sidebarWidth,
        appNavbarHeight,
        controlsWrapperHeight,
        tabsWrapperHeight,
        setSelectedTab,
        updateTab,
    } = storeService.useStore((state) => {
        const {
            appNavbarHeight,
            controlsWrapperHeight,
            tabsWrapperHeight,
            clientSidebarWidth: sidebarWidth,
            setSelectedTab,
            updateTab,
        } = state;

        return {
            appNavbarHeight,
            controlsWrapperHeight,
            tabsWrapperHeight,
            sidebarWidth,
            setSelectedTab,
            updateTab,
        };
    }, shallow);
    const setTabsWrapperHeight = storeService.useStore((state) => state.setTabsWrapperHeight);
    const clientTabsMap = storeService.useStore((state) => state.channelTabs);
    const selectedTabMap = storeService.useStore((state) => state.selectedTabMap);
    const getLocaleText = localeService.useLocaleContext('pages.client_workstation');

    const handleCreateTab = () => {
        // TODO
    };

    const handleLoadChannel = (channelId: string, clientId: string, tabId: string) => {
        updateTab(clientId, tabId, {
            loading: true,
        });
        // TODO
        /**
         * 1. Promise.all([getChannelInfo, getRelation])
         * 2. => data, metadata
         * 3. utilsService.loadChannelBundle => React.FC
         * 4. updateTab with nodes, loading and data
         */
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
            const currentClientTabs = clientTabsMap.get(clientId) || Set<ChannelTab>([]);
            setTabs(currentClientTabs.toArray());
        }
    }, [clientId, clientTabsMap]);

    useEffect(() => {
        if (selectedTabMap) {
            setStartupTabSelected(selectedTabMap.get(clientId) === '@@startup' || !selectedTabMap.get(clientId));
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
                                    closable={false}
                                    avatar="/static/images/all_channels.svg"
                                    title={getLocaleText('all_channels')}
                                    active={startupTabSelected}
                                />
                                {
                                    tabs.map((tab) => {
                                        const {
                                            tabId,
                                            data,
                                            loading,
                                        } = tab;

                                        const {
                                            name,
                                            avatar,
                                        } = data;

                                        return (
                                            <Tab
                                                key={tabId}
                                                loading={loading}
                                                title={name}
                                                avatar={avatar || '/static/images/channel_avatar_fallback.svg'}
                                                active={selectedTabMap.get(clientId) === tabId}
                                            />
                                        );
                                    })
                                }
                                <Tab placeholder={true} />
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
            >
                <ChannelPanel
                    startupTab={startupTabSelected}
                    tabId={selectedTabMap.get(clientId)}
                    {
                        ...(clientTabsMap.get(clientId) || Set<ChannelTab>([]))
                            .find((channelTab) => channelTab.tabId === selectedTabMap.get(clientId))
                    }
                    channelLoader={(channelId) => {
                        handleLoadChannel(channelId, clientId, selectedTabMap.get(clientId));
                    }}
                >
                    {
                        startupTabSelected
                            ? <><button onClick={handleCreateTab}>test</button></>
                            : null
                    }
                </ChannelPanel>
            </SimpleBar>
        </Box>
    );
};

export default ClientWorkstation;
