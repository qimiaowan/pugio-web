import { ReactNode } from 'react';
import { PopoverProps } from '@mui/material/Popover';

type CloseContextMenuFunction = () => void;

export interface ContextMenuChildrenCreatorData {
    closePopover: CloseContextMenuFunction;
}

export interface ContextMenuProps {
    Trigger: ReactNode;
    children: (data: ContextMenuChildrenCreatorData) => ReactNode;
    muiPopoverProps?: Partial<PopoverProps>;
}
