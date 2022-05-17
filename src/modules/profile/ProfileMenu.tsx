import {
    FC,
    useState,
    MouseEvent,
    useEffect,
} from 'react';
import Avatar from '@mui/material/Avatar';
import Box, { BoxProps } from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { InjectedComponentProps } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import { ProfileService } from '@modules/profile/profile.service';
import '@modules/profile/profile-menu.component.less';
import { useRequest } from 'ahooks';
import { LoadingComponent } from '@modules/brand/loading.component';
import { StoreService } from '@modules/store/store.service';
import shallow from 'zustand/shallow';
import { DEFAULT_PICTURE_URL } from '@/constants';

const ProfileMenu: FC<InjectedComponentProps> = ({
    declarations,
}) => {
    const localeService = declarations.get<LocaleService>(LocaleService);
    const storeService = declarations.get<StoreService>(StoreService);
    const profileService = declarations.get<ProfileService>(ProfileService);

    const Loading = declarations.get<FC<BoxProps>>(LoadingComponent);

    const [avatarUrl, setAvatarUrl] = useState<string>(DEFAULT_PICTURE_URL);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const getLocaleText = localeService.useLocaleContext();
    const {
        data: userProfileResponseData,
        loading: getProfileLoading,
    } = useRequest(
        profileService.getProfile.bind(profileService) as typeof profileService.getProfile,
    );
    const {
        userProfile,
        setUserProfile,
    } = storeService.useStore((state) => {
        const {
            userProfile,
            setUserProfile,
        } = state;

        return {
            userProfile,
            setUserProfile,
        };
    }, shallow);

    const open = Boolean(anchorEl);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (userProfileResponseData?.response) {
            setUserProfile(userProfileResponseData.response);
        }
    }, [userProfileResponseData]);

    useEffect(() => {
        if (userProfile) {
            setAvatarUrl(userProfile.picture || DEFAULT_PICTURE_URL);
        }
    }, [userProfile]);

    return (
        getProfileLoading
            ? <Loading className="profile-loading" />
            : <Box className="profile-menu">
                <IconButton
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <Avatar
                        classes={{
                            root: 'avatar',
                        }}
                        src={avatarUrl}
                        imgProps={{
                            onError: () => {
                                if (avatarUrl !== DEFAULT_PICTURE_URL) {
                                    setAvatarUrl(DEFAULT_PICTURE_URL);
                                }
                            },
                        }}
                    />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <ListItemButton>
                        <ListItemIcon><Icon className="icon-account" /></ListItemIcon>
                        <ListItemText>{getLocaleText('app.avatarDropdown.settings')}</ListItemText>
                    </ListItemButton>
                    <ListItemButton>
                        <ListItemIcon><Icon className="icon-logout" /></ListItemIcon>
                        <ListItemText>{getLocaleText('app.avatarDropdown.signout')}</ListItemText>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemIcon><Icon className="icon-account-add" /></ListItemIcon>
                        <ListItemText>{getLocaleText('app.avatarDropdown.create')}</ListItemText>
                    </ListItemButton>
                </Menu>
            </Box>
    );
};

export default ProfileMenu;
