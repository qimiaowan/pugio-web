import {
    FC,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import { InjectedComponentProps } from 'khamsa';
import {
    NavLink,
    Outlet,
    useParams,
    useNavigate,
} from 'react-router-dom';
import { LocaleService } from '@modules/locale/locale.service';
import { StoreService } from '@modules/store/store.service';
import { ClientMenuItemComponent } from '@modules/client/client-menu-item.component';
import { ClientMenuItemProps } from '@modules/client/client-menu-item.interface';
import { ClientService } from '@modules/client/client.service';
import _ from 'lodash';
import { useRequest } from 'ahooks';
import '@modules/client/client-dashboard.component.less';

interface MenuMetadataItem {
    to: string;
    icon: string;
    titleSlotId: string;
}

const ClientDashboard: FC<InjectedComponentProps> = ({ declarations }) => {
    const ClientMenuItem = declarations.get<FC<ClientMenuItemProps>>(ClientMenuItemComponent);
    const localeService = declarations.get<LocaleService>(LocaleService);
    const storeService = declarations.get<StoreService>(StoreService);
    const clientService = declarations.get<ClientService>(ClientService);

    const { client_id: clientId } = useParams();
    const navigate = useNavigate();
    const sidebarRef = useRef<HTMLDivElement>(null);
    const controlsWrapperRef = useRef<HTMLDivElement>(null);
    const getLocaleText = localeService.useLocaleContext();
    const getPageLocaleText = localeService.useLocaleContext('pages.client_workstation');
    const [fullWidthMenu, setFullWidthMenu] = useState<boolean>(false);
    const [menuMetadataItems, setMenuMetadataItems] = useState<MenuMetadataItem[]>([]);
    const setSidebarWidth = storeService.useStore((state) => state.setClientSidebarWidth);
    const setControlsWrapperHeight = storeService.useStore((state) => state.setControlsWrapperHeight);
    const switchClientsDropdownVisibility = storeService.useStore((state) => state.switchClientsDropdownVisibility);
    const {
        data: getClientInformationResponseData,
    } = useRequest(
        () => {
            const getClientInformation = clientService.getClientInformation.bind(clientService) as typeof clientService.getClientInformation;
            return getClientInformation({ clientId });
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

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            const [observationData] = entries;

            if (observationData) {
                const blockSize = _.get(observationData, 'borderBoxSize[0].blockSize');

                if (_.isNumber(blockSize)) {
                    setControlsWrapperHeight(blockSize);
                }
            }
        });

        if (controlsWrapperRef.current) {
            observer.observe(controlsWrapperRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [controlsWrapperRef]);

    const updateMenuMetadataItems = useCallback(() => {
        if (clientId) {
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
    }, [clientId]);

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
                            } = menuMetadataItem;

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
                <Box className="controls" ref={controlsWrapperRef}>
                    {
                        getClientInformationResponseData?.response && (
                            <>
                                <Icon className="icon-server" />
                                <Typography
                                    variant="subtitle2"
                                    className="client-name"
                                    noWrap={true}
                                    title={getClientInformationResponseData?.response?.name || null}
                                >{getClientInformationResponseData?.response?.name || null}</Typography>
                            </>
                        )
                    }
                    <Button
                        size="small"
                        classes={{ sizeSmall: 'control-button' }}
                        startIcon={<Icon className="icon-plus" />}
                        onClick={() => navigate('/clients/create')}
                    >{getPageLocaleText('create')}</Button>
                    <Button
                        size="small"
                        classes={{ sizeSmall: 'control-button' }}
                        startIcon={<Icon className="icon-switch" />}
                        onClick={() => switchClientsDropdownVisibility(true)}
                    >{getPageLocaleText('switch')}</Button>
                </Box>
                <Outlet />
            </Box>
        </Box>
    );
};

export default ClientDashboard;
