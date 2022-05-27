import { PopoverProps as MuiPopoverProps } from '@mui/material/Popover';
import {
    FC,
    ReactNode,
    MouseEvent,
} from 'react';

type ClosePopoverFunction = () => void;

interface TriggerProps {
    open: boolean;
    openPopover: (event: MouseEvent<any>) => void;
}

export interface PopoverChildrenCreatorData {
    closePopover: ClosePopoverFunction;
}

export interface PopoverProps {
    Trigger: FC<TriggerProps>;
    children: (data: PopoverChildrenCreatorData) => ReactNode;
    variant?: 'menu' | 'popover';
    muiPopoverProps?: Partial<MuiPopoverProps>;
}
