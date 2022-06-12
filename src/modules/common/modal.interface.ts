import Dialog, { DialogProps } from '@mui/material/Dialog';
import {
    FC,
    ReactNode,
    MouseEvent,
} from 'react';

type CloseModalFunction = () => void;

export interface ModalTriggerProps {
    open: boolean;
    openModal: (event: MouseEvent<any>) => void;
}

export interface ModalChildrenCreatorData {
    closeModal: CloseModalFunction;
}

export interface ModalProps {
    Trigger: FC<ModalTriggerProps>;
    muiDialogProps?: Partial<DialogProps>;
    DialogComponent?: typeof Dialog;
    children: (data: ModalChildrenCreatorData) => ReactNode;
}
