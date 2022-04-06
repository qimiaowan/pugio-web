import {
    FC,
    useCallback,
    useEffect,
    useState,
} from 'react';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import './client-dashboard.component.less';
import { InjectedComponentProps } from 'khamsa';
import { ClientMenuItemComponent } from './client-menu-item.component';
import { ClientMenuItemProps } from './client-menu-item.interface';
import {
    NavLink,
    Outlet,
    useParams,
} from 'react-router-dom';
import { LocaleService } from '../locale/locale.service';

interface MenuMetadataItem {
    to: string;
    icon: string;
    titleSlotId: string;
}

const ClientDashboard: FC<InjectedComponentProps> = ({ declarations }) => {
    const ClientMenuItem = declarations.get<FC<ClientMenuItemProps>>(ClientMenuItemComponent);
    const localeService = declarations.get<LocaleService>(LocaleService);

    const params = useParams();
    const getLocaleText = localeService.useLocaleContext();
    const [fullWidthMenu, setFullWidthMenu] = useState<boolean>(false);
    const [menuMetadataItems, setMenuMetadataItems] = useState<MenuMetadataItem[]>([]);

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

    const updateMenuMetadataItems = useCallback(() => {
        if (params.client_id) {
            const clientId = params.client_id;
            setMenuMetadataItems(
                [
                    {
                        icon: 'icon-apps',
                        to: `/clients/${clientId}/workstation`,
                        titleSlotId: 'clientsSidebarMenu.workstation',
                    },
                    {
                        icon: 'icon-users',
                        to: `/clients/${clientId}/members`,
                        titleSlotId: 'clientsSidebarMenu.members',
                    },
                    {
                        icon: 'icon-info',
                        to: `/clients/${clientId}/details`,
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
            <Box className="sidebar">
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
            <Box className="content-container"><Outlet /></Box>
        </Box>
    );
};

export default ClientDashboard;
