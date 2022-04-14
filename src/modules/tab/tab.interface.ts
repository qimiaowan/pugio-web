import { BoxProps } from '@mui/material/Box';

export interface TabProps extends BoxProps {
    title?: string;
    closable?: boolean;
    avatar?: string;
    active?: boolean;
    slotElement?: boolean;
    loading?: boolean;
    errored?: boolean;
    startup?: boolean;
    onClose?: () => void;
}
