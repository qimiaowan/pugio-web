import { BoxProps } from '@mui/material/Box';
import { Profile } from '@modules/profile/profile.interface';
import { CheckboxProps } from '@mui/material/Checkbox';
import { ReactElement } from 'react';

export interface UserCardMenuItem {
    icon: string;
    title: string;
    extra?: string;
    onActive?: () => void;
}

export interface UserCardProps extends BoxProps {
    profile: Profile;
    controlSlot?: ReactElement;
    checkable?: boolean;
    checked?: boolean;
    menu?: UserCardMenuItem[];
    checkboxProps?: CheckboxProps;
    autoHide?: boolean;
    onCheckStatusChange?: (checked: boolean) => void;
}

export interface UserCardMenuProps {
    menu: UserCardMenuItem[];
}
