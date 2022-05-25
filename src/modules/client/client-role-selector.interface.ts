import { ListItemButtonProps } from '@mui/material/ListItemButton';
import { ButtonProps } from '@mui/material/Button';
import { MenuProps } from '@mui/material/Menu';

type ListItemButtonsPropsCreator = (role: number, checked: boolean) => ListItemButtonProps;

export interface ClientRoleSelectorProps {
    role: number;
    triggerProps?: ButtonProps;
    menuProps?: Partial<MenuProps>;
    listItemButtonProps?: ListItemButtonProps | ListItemButtonsPropsCreator;
    onRoleChange?: (role: number) => void;
}
