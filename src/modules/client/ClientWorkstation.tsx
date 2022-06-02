/* eslint-disable no-unused-vars */
import {
    FC,
    useEffect,
    useState,
} from 'react';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { InjectedComponentProps } from 'khamsa';
import { ChannelPanelComponent } from '@modules/channel/channel-panel.component';
import { ChannelPanelProps } from '@modules/channel/channel.interface';
import { LocaleService } from '@modules/locale/locale.service';
import { StoreService } from '@modules/store/store.service';
import { useTheme } from '@mui/material/styles';
import shallow from 'zustand/shallow';
import SimpleBar from 'simplebar-react';
import {
    ChannelTab,
    TabData,
} from '@modules/store/store.interface';
import { ClientService } from '@modules/client/client.service';
import { UtilsService } from '@modules/utils/utils.service';
import { useParams } from 'react-router-dom';
import { List } from 'immutable';
import { ExceptionProps } from '@modules/brand/exception.interface';
import { ExceptionComponent } from '@modules/brand/exception.component';
import { ChannelListComponent } from '@modules/channel/channel-list.component';
import { ChannelListProps } from '@modules/channel/channel-list.interface';
import styled from '@mui/material/styles/styled';
import { PopoverProps } from '@modules/common/popover.interface';
import { PopoverComponent } from '@modules/common/popover.component';
import Color from 'color';
import { ClientWorkstationTabsProps } from '@modules/client/client-workstation-tabs.interface';
import { ClientWorkstationTabsComponent } from '@modules/client/client-workstation-tabs.component';
import _ from 'lodash';

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

const ClientWorkstation: FC<InjectedComponentProps> = ({
    declarations,
}) => {
    const ChannelPanel = declarations.get<FC<ChannelPanelProps>>(ChannelPanelComponent);
    const localeService = declarations.get<LocaleService>(LocaleService);
    const storeService = declarations.get<StoreService>(StoreService);
    const clientService = declarations.get<ClientService>(ClientService);
    const utilsService = declarations.get<UtilsService>(UtilsService);
    const Exception = declarations.get<FC<ExceptionProps>>(ExceptionComponent);
    const ChannelList = declarations.get<FC<ChannelListProps>>(ChannelListComponent);
    // const configService = declarations.get<ConfigService>(ConfigService);
    const Popover = declarations.get<FC<PopoverProps>>(PopoverComponent);
    const ClientWorkstationTabs = declarations.get<FC<ClientWorkstationTabsProps>>(ClientWorkstationTabsComponent);

    const theme = useTheme();
    const { client_id: clientId } = useParams();
    const locale = localeService.useContextLocale();
    const [headerWidth, setHeaderWidth] = useState<number>(null);
    const [panelHeight, setPanelHeight] = useState<number>(null);
    const {
        selectedTabMap,
        appNavbarHeight,
        windowInnerHeight,
        windowInnerWidth,
        clientTabsMap,
        sidebarWidth,
        tabsWrapperHeight,
        setSelectedTab,
        createTab,
    } = storeService.useStore((state) => {
        const {
            selectedTabMap,
            clientSidebarWidth: sidebarWidth,
            appNavbarHeight,
            windowInnerHeight,
            windowInnerWidth,
            channelTabs: clientTabsMap,
            tabsWrapperHeight,
            setSelectedTab,
            createTab,
        } = state;

        return {
            selectedTabMap,
            sidebarWidth,
            appNavbarHeight,
            windowInnerHeight,
            windowInnerWidth,
            clientTabsMap,
            tabsWrapperHeight,
            setSelectedTab,
            createTab,
        };
    }, shallow);
    const getLocaleText = localeService.useLocaleContext('pages.clientWorkstation');
    const [selectedTabId, setSelectedTabId] = useState<string>(null);
    const [clientOffline, setClientOffline] = useState<boolean>(false);
    const [lastSelectedTabId, setLastSelectedTabId] = useState<string>(null);
    const [selectedTabMetadata, setSelectedTabMetadata] = useState<string[]>([]);
    const [tabs, setTabs] = useState<ChannelTab[]>([]);

    const handleCreateTab = (clientId: string, data: TabData = {}) => {
        const tabId = createTab(clientId, data);
        setSelectedTab(clientId, `${tabId}:scroll`);
    };

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

    useEffect(() => {
        if (clientId && clientTabsMap) {
            const currentClientTabs = (clientTabsMap.get(clientId) || List<ChannelTab>([])).toArray();
            setTabs(currentClientTabs);
        }
    }, [clientId, clientTabsMap]);

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

    useEffect(() => {
        if (_.isNumber(sidebarWidth) && _.isNumber(windowInnerWidth)) {
            setHeaderWidth(windowInnerWidth - sidebarWidth);
        }
    }, [sidebarWidth, windowInnerWidth]);

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
                            <ClientWorkstationTabs
                                tabs={tabs}
                                selectedTabId={selectedTabId}
                                selectedTabMetadata={selectedTabMetadata}
                                headerWidth={headerWidth}
                                panelHeight={panelHeight}
                                onGoHome={setLastSelectedTabId}
                                onSelectedTabIdChange={setSelectedTabId}
                            />
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
                                    {/* FIXME temporarily prevent flash popover */}
                                    <ChannelList />
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
