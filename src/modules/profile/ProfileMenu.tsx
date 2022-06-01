import {
    FC,
    useState,
    useEffect,
} from 'react';
import Avatar from '@mui/material/Avatar';
import { BoxProps } from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { InjectedComponentProps } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import { ProfileService } from '@modules/profile/profile.service';
import { useRequest } from 'ahooks';
import { LoadingComponent } from '@modules/brand/loading.component';
import { StoreService } from '@modules/store/store.service';
import shallow from 'zustand/shallow';
import { ConfigService } from '@modules/config/config.service';
import { PopoverComponent } from '@modules/common/popover.component';
import { PopoverProps } from '@modules/common/popover.interface';
import useTheme from '@mui/material/styles/useTheme';

const ProfileMenu: FC<InjectedComponentProps> = ({
    declarations,
}) => {
    const localeService = declarations.get<LocaleService>(LocaleService);
    const storeService = declarations.get<StoreService>(StoreService);
    const profileService = declarations.get<ProfileService>(ProfileService);
    const configService = declarations.get<ConfigService>(ConfigService);
    const Popover = declarations.get<FC<PopoverProps>>(PopoverComponent);

    const Loading = declarations.get<FC<BoxProps>>(LoadingComponent);

    const theme = useTheme();
    const [avatarUrl, setAvatarUrl] = useState<string>(configService.DEFAULT_PICTURE_URL);
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

    useEffect(() => {
        if (userProfileResponseData?.response) {
            setUserProfile(userProfileResponseData.response);
        }
    }, [userProfileResponseData]);

    useEffect(() => {
        if (userProfile) {
            setAvatarUrl(userProfile.picture || configService.DEFAULT_PICTURE_URL);
        }
    }, [userProfile]);

    return (
        getProfileLoading
            ? <Loading style={{ width: 31, height: '31px !important' }} />
            : <Popover
                variant="menu"
                Trigger={({ open, openPopover }) => {
                    return (
                        <IconButton
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            sx={{
                                ...(open ? {
                                    backgroundColor: theme.palette.mode === 'dark'
                                        ? theme.palette.grey[700]
                                        : theme.palette.grey[300],
                                } : {}),
                            }}
                            onClick={openPopover}
                        >
                            <Avatar
                                sx={{
                                    width: '21px',
                                    height: '21px',
                                    pointerEvents: 'none',
                                }}
                                src={avatarUrl}
                            />
                        </IconButton>
                    );
                }}
            >
                {
                    ({ closePopover }) => {
                        return (
                            <>
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
                            </>
                        );
                    }
                }
            </Popover>
    );
};

export default ProfileMenu;
