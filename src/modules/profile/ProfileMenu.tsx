import {
    FC,
    useState,
    MouseEvent,
    useEffect,
    useCallback,
} from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { InjectedComponentProps } from 'khamsa';
import { Profile } from '@modules/profile/profile.interface';
import { LocaleService } from '@modules/locale/locale.service';
import { ProfileService } from '@modules/profile/profile.service';
import '@modules/profile/profile-menu.component.less';

const DEFAULT_PICTURE_URL = '/static/images/profile_avatar_fallback.svg';

const LocaleMenu: FC<InjectedComponentProps> = ({
    declarations,
}) => {
    const localeService = declarations.get<LocaleService>(LocaleService);
    const profileService = declarations.get<ProfileService>(ProfileService);

    const [userProfile, setUserProfile] = useState<Profile>(null);
    const [avatarUrl, setAvatarUrl] = useState<string>(DEFAULT_PICTURE_URL);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const getLocaleText = localeService.useLocaleContext();

    const open = Boolean(anchorEl);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (userProfile) {
            setAvatarUrl(userProfile.picture || DEFAULT_PICTURE_URL);
        }
    }, [userProfile]);

    const getProfile = useCallback(() => {
        if (!userProfile) {
            profileService.getProfile().then((response) => {
                setUserProfile(response.response);
            });
        }
    }, [userProfile]);

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <Box className="profile-menu">
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
                <MenuItem>
                    <ListItemIcon><Icon className="icon-account" /></ListItemIcon>
                    <ListItemText>{getLocaleText('app.avatarDropdown.settings')}</ListItemText>
                </MenuItem>
                <MenuItem>
                    <ListItemIcon><Icon className="icon-logout" /></ListItemIcon>
                    <ListItemText>{getLocaleText('app.avatarDropdown.signout')}</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem>
                    <ListItemIcon><Icon className="icon-account-add" /></ListItemIcon>
                    <ListItemText>{getLocaleText('app.avatarDropdown.create')}</ListItemText>
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default LocaleMenu;
