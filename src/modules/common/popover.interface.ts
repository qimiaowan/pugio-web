import Popover, { PopoverProps as MuiPopoverProps } from '@mui/material/Popover';
import {
    FC,
    ReactNode,
    MouseEvent,
} from 'react';

type ClosePopoverFunction = () => void;

export interface PopoverTriggerProps {
    open: boolean;
    openPopover: (event: MouseEvent<any>) => void;
}

export interface PopoverChildrenCreatorData {
    closePopover: ClosePopoverFunction;
}

export interface PopoverProps {
    Trigger: FC<PopoverTriggerProps>;
    variant?: 'menu' | 'popover';
    muiPopoverProps?: Partial<MuiPopoverProps>;
    PopoverComponent?: typeof Popover;
    children: (data: PopoverChildrenCreatorData) => ReactNode;
}
