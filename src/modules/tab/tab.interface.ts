import { BoxProps } from '@mui/material/Box';

export interface TabProps extends BoxProps {
    channelId?: string;
    title?: string;
    closable?: boolean;
    avatar?: string;
    active?: boolean;
    slotElement?: boolean;
    loading?: boolean;
    errored?: boolean;
    startup?: boolean;
    metadata?: string[];
    onClose?: () => void;
    onDataLoad?: (channelId: string) => void;
    onTitleChange?: (title: string) => void;
    onSelectedScroll?: (offsetLeft: number, clientWidth: number) => void;
}
