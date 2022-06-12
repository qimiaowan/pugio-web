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
}) => {
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
            <Dialog
                open={open}
                {...muiDialogProps}
            >
                {
                    children({
                        closeModal,
                    })
                }
            </Dialog>
        </>
    );
};

export default Modal;
