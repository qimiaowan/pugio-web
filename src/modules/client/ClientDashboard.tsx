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
import _ from 'lodash';
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

    const params = useParams();
    const navigate = useNavigate();
    const sidebarRef = useRef<HTMLDivElement>(null);
    const getLocaleText = localeService.useLocaleContext();
    const getPageLocaleText = localeService.useLocaleContext('pages.client_workstation');
    const [fullWidthMenu, setFullWidthMenu] = useState<boolean>(false);
    const [menuMetadataItems, setMenuMetadataItems] = useState<MenuMetadataItem[]>([]);
    const changeSidebarWidth = storeService.useStore((state) => state.changeClientSidebarWidth);
    const switchClientsDropdownVisibility = storeService.useStore((state) => state.switchClientsDropdownVisibility);

    const generateFullWidthMenuKey = (id: string) => {
        return `app.client.fullWidthMenu@${id}`;
    };

    const handleExpandCollapseClick = () => {
        localStorage.setItem(
            generateFullWidthMenuKey(params.client_id),
            JSON.stringify(!fullWidthMenu),
        );
        setFullWidthMenu(!fullWidthMenu);
    };

    useEffect(() => {
        if (params?.client_id) {
            setFullWidthMenu(
                JSON.parse(
                    localStorage.getItem(
                        generateFullWidthMenuKey(params.client_id),
                    ) || 'false',
                ),
            );
        }
    }, [params]);

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            const [sidebarObservationData] = entries;

            if (sidebarObservationData) {
                const sidebarInlineSize = _.get(sidebarObservationData, 'borderBoxSize[0].inlineSize');

                if (_.isNumber(sidebarInlineSize)) {
                    changeSidebarWidth(sidebarInlineSize);
                }
            }
        });

        if (sidebarRef.current) {
            observer.observe(sidebarRef.current);
        }

        return () => {
            observer.unobserve(sidebarRef.current);
        };
    }, [sidebarRef]);

    const updateMenuMetadataItems = useCallback(() => {
        if (params.client_id) {
            const clientId = params.client_id;
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
                        icon: 'icon-info',
                        to: `/client/${clientId}/details`,
                        titleSlotId: 'clientsSidebarMenu.details',
                    },
                ],
            );
        }
    }, [params.client_id]);

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
                <Box className="controls">
                    <Typography variant="subtitle2" className="client-name">Client Placeholder</Typography>
                    <Button
                        size="small"
                        classes={{ sizeSmall: 'control-button' }}
                        startIcon={<Icon className="icon-plus" />}
                        onClick={() => navigate('/client/create')}
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
