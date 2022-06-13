import { ReactNode } from 'react';
import Popover, { PopoverProps } from '@mui/material/Popover';

type CloseContextMenuFunction = () => void;

export interface ContextMenuChildrenCreatorData {
    closePopover: CloseContextMenuFunction;
}

export interface ContextMenuProps {
    Trigger: ReactNode;
    PopoverComponent?: typeof Popover;
    muiPopoverProps?: Partial<PopoverProps>;
    children: (data: ContextMenuChildrenCreatorData) => ReactNode;
}
