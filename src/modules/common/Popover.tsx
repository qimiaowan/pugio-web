import {
    createElement,
    FC,
    useRef,
    useState,
} from 'react';
import Box from '@mui/material/Box';
import MuiPopover from '@mui/material/Popover';
import { PopoverProps } from '@modules/common/popover.interface';
import clsx from 'clsx';
import styled from '@mui/material/styles/styled';

const StyledMuiPopover = styled(MuiPopover)(({ theme }) => {
    return `
        .popover-variant {
            &-menu {
                padding: ${theme.spacing(1)} 0;
            }
        }
    `;
});

const Popover: FC<PopoverProps> = ({
    Trigger,
    children,
    variant = 'popover',
    muiPopoverProps = {},
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
            <StyledMuiPopover
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                {...muiPopoverProps}
                classes={{
                    paper: clsx(muiPopoverProps?.classes?.paper, `popover-variant-${variant}`),
                }}
                open={visible}
                anchorEl={anchorEl.current}
                onClose={handleClose}
            >
                {
                    children({
                        closePopover: handleClose,
                    })
                }
            </StyledMuiPopover>
        </Box>
    );
};

export default Popover;
