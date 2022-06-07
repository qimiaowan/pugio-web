import {
    FC,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import { getContainer } from 'khamsa';
import {
    NavLink,
    Outlet,
    useParams,
} from 'react-router-dom';
import { LocaleService } from '@modules/locale/locale.service';
import { StoreService } from '@modules/store/store.service';
import { ClientMenuItemComponent } from '@modules/client/client-menu-item.component';
import { ClientMenuItemProps } from '@modules/client/client-menu-item.interface';
import { ClientService } from '@modules/client/client.service';
import _ from 'lodash';
import { useRequest } from 'ahooks';
import { UserClientRelationResponseData } from '@modules/client/client.interface';
import styled from '@mui/material/styles/styled';
import shallow from 'zustand/shallow';

interface MenuMetadataItem {
    to: string;
    icon: string;
    titleSlotId: string;
    condition?: (relation: UserClientRelationResponseData) => boolean;
}

const ClientDashboardContainer = styled(Box)(({ theme }) => {
    const mode = theme.palette.mode;

    return `
        max-width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: nowrap;
        align-items: stretch;

        .sidebar {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch;
            flex-shrink: 1;
            flex-grow: 0;
            box-sizing: border-box;
            padding: ${theme.spacing(2)} 0;
            padding-top: 0;
            background-color: ${mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50]};
            border-right: 1px solid ${theme.palette.divider};

            .menu-container {
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                flex-shrink: 0;
                flex-grow: 1;
                overflow-y: auto;

                .sidebar-link {
                    display: block;
                    text-decoration: none;
                    user-select: none;
                }
            }

            .expand-collapse-container {
                box-sizing: border-box;
                padding: ${theme.spacing(1)};
                display: flex;
                justify-content: center;
                align-items: center;
                flex-grow: 0;

                .pugio-icons {
                    color: ${theme.palette.text.primary};
                }
            }
        }

        .content-container {
            flex-shrink: 1;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            align-items: stretch;

            .controls {
                border-bottom: 1px solid ${theme.palette.divider};
                padding: ${theme.spacing(1)};
                display: flex;
                align-items: center;
                background-color: ${mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50]};

                .client-name {
                    font-weight: 700;
                    color: ${mode === 'dark' ? theme.palette.grey[50] : theme.palette.grey[900]};
                    user-select: none;
                    max-width: 120px;
                }

                & > * {
                    margin-right: 10px;
                }
            }
        }
    `;
});

const ClientDashboard: FC = () => {
    const container = getContainer(ClientDashboard);
    const ClientMenuItem = container.get<FC<ClientMenuItemProps>>(ClientMenuItemComponent);
    const localeService = container.get<LocaleService>(LocaleService);
    const storeService = container.get<StoreService>(StoreService);
    const clientService = container.get<ClientService>(ClientService);

    const { client_id: clientId } = useParams();
    const sidebarRef = useRef<HTMLDivElement>(null);
    const getLocaleText = localeService.useLocaleContext();
    const [fullWidthMenu, setFullWidthMenu] = useState<boolean>(false);
    const [menuMetadataItems, setMenuMetadataItems] = useState<MenuMetadataItem[]>([]);
    const {
        setSidebarWidth,
        changeSelectedClientId,
    } = storeService.useStore((state) => {
        const {
            setClientSidebarWidth,
            changeSelectedClientId,
        } = state;

        return {
            setSidebarWidth: setClientSidebarWidth,
            changeSelectedClientId,
        };
    }, shallow);
    const {
        data: userClientRelationResponseData,
    } = useRequest(
        () => {
            return clientService.getUserClientRelation({ clientId });
        },
        {
            refreshDeps: [clientId],
        },
    );

    const generateFullWidthMenuKey = (id: string) => {
        return `app.client.fullWidthMenu@${id}`;
    };

    const handleExpandCollapseClick = () => {
        localStorage.setItem(
            generateFullWidthMenuKey(clientId),
            JSON.stringify(!fullWidthMenu),
        );
        setFullWidthMenu(!fullWidthMenu);
    };

    useEffect(() => {
        if (clientId) {
            setFullWidthMenu(
                JSON.parse(
                    localStorage.getItem(
                        generateFullWidthMenuKey(clientId),
                    ) || 'false',
                ),
            );
        }

        changeSelectedClientId(clientId || '');
        localStorage.setItem('app.selectedClientId', clientId || '');
    }, [clientId]);

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            const [observationData] = entries;

            if (observationData) {
                const sidebarInlineSize = _.get(observationData, 'borderBoxSize[0].inlineSize');

                if (_.isNumber(sidebarInlineSize)) {
                    setSidebarWidth(sidebarInlineSize);
                }
            }
        });

        if (sidebarRef.current) {
            observer.observe(sidebarRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [sidebarRef]);

    const updateMenuMetadataItems = useCallback(() => {
        if (clientId && userClientRelationResponseData?.response) {
            setMenuMetadataItems(
                [
                    {
                        icon: 'icon-apps',
                        to: `/client/${clientId}/workstation`,
                        titleSlotId: 'clientsSidebarMenu.workstation',
                    },
                    {
                        icon: 'icon-users',
                        to: `/client/${clientId}/members`,
                        titleSlotId: 'clientsSidebarMenu.members',
                        condition: (relation) => {
                            return relation.roleType <= 1;
                        },
                    },
                    {
                        icon: 'icon-status',
                        to: `/client/${clientId}/status`,
                        titleSlotId: 'clientsSidebarMenu.status',
                    },
                    {
                        icon: 'icon-info',
                        to: `/client/${clientId}/details`,
                        titleSlotId: 'clientsSidebarMenu.details',
                    },
                ],
            );
        }
    }, [clientId, userClientRelationResponseData]);

    useEffect(() => {
        updateMenuMetadataItems();
    }, [clientId, userClientRelationResponseData]);

    return (
        <ClientDashboardContainer>
            <Box className="sidebar" ref={sidebarRef}>
                <Box className="menu-container">
                    {
                        menuMetadataItems.map((menuMetadataItem) => {
                            const {
                                icon,
                                to,
                                titleSlotId,
                                condition,
                            } = menuMetadataItem;

                            if (_.isFunction(condition) && !condition(userClientRelationResponseData?.response)) {
                                return null;
                            }

                            return (
                                <NavLink
                                    key={titleSlotId}
                                    className="sidebar-link"
                                    to={to}
                                >
                                    {
                                        ({ isActive }) => {
                                            return (
                                                <ClientMenuItem
                                                    fullWidth={fullWidthMenu}
                                                    active={isActive}
                                                    icon={<Icon className={icon} />}
                                                    title={getLocaleText(titleSlotId)}
                                                />
                                            );
                                        }
                                    }
                                </NavLink>
                            );
                        })
                    }
                    {
                        menuMetadataItems.length === 0 && (
                            new Array(3).fill(null).map((value, index) => {
                                return (
                                    <ClientMenuItem
                                        key={index}
                                        fullWidth={fullWidthMenu}
                                        skeleton={true}
                                        title=""
                                        icon=""
                                    />
                                );
                            })
                        )
                    }
                </Box>
                {
                    menuMetadataItems.length > 0 && (
                        <Box className="expand-collapse-container">
                            <IconButton onClick={handleExpandCollapseClick}>
                                <Icon className={`icon-double-${fullWidthMenu ? 'left' : 'right'}-arrow`} />
                            </IconButton>
                        </Box>
                    )
                }
            </Box>
            <Box className="content-container">
                <Outlet />
            </Box>
        </ClientDashboardContainer>
    );
};

export default ClientDashboard;
