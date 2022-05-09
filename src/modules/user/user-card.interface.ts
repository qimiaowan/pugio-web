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
    checkable?: boolean;
    checked?: boolean;
    menu?: UserCardMenuItem[];
    onCheckStatusChange?: (checked: boolean) => void;
}

export interface UserCardMenuProps {
    menu: UserCardMenuItem[];
}
