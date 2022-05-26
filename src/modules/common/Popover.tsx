import {
    createElement,
    FC,
    useRef,
    useState,
} from 'react';
import Box from '@mui/material/Box';
import MuiPopover from '@mui/material/Popover';
import { PopoverProps } from '@modules/common/popover.interface';

const Popover: FC<PopoverProps> = ({
    Trigger,
    children,
    ...props
}) => {
    const anchorEl = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState<boolean>(false);

    const handleOpen = () => {
        setVisible(true);
    };

    const handleClose = () => {
        setVisible(false);
    };

    return (
        <Box ref={anchorEl}>
            {
                createElement(Trigger, {
                    open: visible,
                    openPopover: handleOpen,
                })
            }
            <MuiPopover
                open={visible}
                anchorEl={anchorEl.current}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                onClose={handleClose}
            >
                {
                    children({
                        closePopover: handleClose,
                    })
                }
            </MuiPopover>
        </Box>
    );
};

export default Popover;
