import {
    createElement,
    FC,
    useState,
} from 'react';
import { ModalProps } from '@modules/common/modal.interface';
import Dialog from '@mui/material/Dialog';

const Modal: FC<ModalProps> = ({
    Trigger,
    children,
    muiDialogProps = {},
    DialogComponent,
}) => {
    const ModalDialog = DialogComponent || Dialog;

    const [open, setOpen] = useState<boolean>(false);

    const closeModal = () => {
        setOpen(false);
    };

    const openModal = () => {
        setOpen(true);
    };

    return (
        <>
            {
                createElement(Trigger, {
                    open,
                    openModal,
                })
            }
            <ModalDialog
                open={open}
                {...muiDialogProps}
            >
                {
                    children({
                        closeModal,
                    })
                }
            </ModalDialog>
        </>
    );
};

export default Modal;
