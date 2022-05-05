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
import { InjectedComponentProps } from 'khamsa';
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
import '@modules/client/client-dashboard.component.less';
import { UserClientRelationResponseData } from '@modules/client/client.interface';

interface MenuMetadataItem {
    to: string;
    icon: string;
    titleSlotId: string;
    condition?: (relation: UserClientRelationResponseData) => boolean;
}

const ClientDashboard: FC<InjectedComponentProps> = ({ declarations }) => {
    const ClientMenuItem = declarations.get<FC<ClientMenuItemProps>>(ClientMenuItemComponent);
    const localeService = declarations.get<LocaleService>(LocaleService);
    const storeService = declarations.get<StoreService>(StoreService);
    const clientService = declarations.get<ClientService>(ClientService);

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
    });
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
    }, [updateMenuMetadataItems]);

    return (
        <Box className="client-dashboard-container">
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
                </Box>
                <Box className="expand-collapse-container">
                    <IconButton onClick={handleExpandCollapseClick}>
                        <Icon className={`icon-double-${fullWidthMenu ? 'left' : 'right'}-arrow`} />
                    </IconButton>
                </Box>
            </Box>
            <Box className="content-container">
                <Outlet />
            </Box>
        </Box>
    );
};

export default ClientDashboard;
