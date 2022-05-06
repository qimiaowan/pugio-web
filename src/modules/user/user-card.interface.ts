import { BoxProps } from '@mui/material/Box';
import { Profile } from '@modules/profile/profile.interface';

export interface UserCardMenuItem {
    icon: string;
    title: string;
    extra?: string;
    onActive?: () => void;
}

export interface UserCardProps extends BoxProps {
    profile: Profile;
    menu?: UserCardMenuItem[];
}

export interface UserCardMenuProps {
    menu: UserCardMenuItem[];
}
