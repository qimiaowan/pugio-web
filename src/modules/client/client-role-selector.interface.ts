import { ListItemButtonProps } from '@mui/material/ListItemButton';
import { ButtonProps } from '@mui/material/Button';
import { PopoverProps } from '@mui/material/Popover';

type ListItemButtonsPropsCreator = (role: number, checked: boolean) => ListItemButtonProps;

export interface ClientRoleSelectorProps {
    role: number;
    triggerProps?: ButtonProps;
    popoverProps?: Partial<PopoverProps>;
    listItemButtonProps?: ListItemButtonProps | ListItemButtonsPropsCreator;
    onRoleChange?: (role: number) => void;
}
