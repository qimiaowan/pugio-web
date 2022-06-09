import {
    FC,
    useRef,
    useState,
    MouseEvent as ReactMouseEvent,
} from 'react';
import Box from '@mui/material/Box';
import MuiPopover from '@mui/material/Popover';
import { ContextMenuProps } from '@modules/common/context-menu.interface';
import clsx from 'clsx';
import styled from '@mui/material/styles/styled';
import _ from 'lodash';

const StyledMuiPopover = styled(MuiPopover)(({ theme }) => {
    return `
        .context-menu-paper {
            padding: ${theme.spacing(1)} 0;
        }

        hr {
            margin: ${theme.spacing(1)} 0;
        }
    `;
});

const ContextMenu: FC<ContextMenuProps> = ({
    Trigger,
    children,
    muiPopoverProps = {},
}) => {
    const anchorEl = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState<boolean>(false);
    const [anchorLeft, setAnchorLeft] = useState<number>(-1);
    const [anchorTop, setAnchorTop] = useState<number>(-1);

    const handleOpen = (event: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
        setAnchorLeft(event.clientX + document.body.scrollLeft - document.body.clientLeft);
        setAnchorTop(event.clientY + document.body.scrollTop - document.body.clientTop);
        event.stopPropagation();
        event.preventDefault();
        setVisible(true);
        return false;
    };

    const handleClose = () => {
        setAnchorLeft(-1);
        setAnchorTop(-1);
        setVisible(false);
    };

    return (
        <Box
            ref={anchorEl}
            onContextMenu={handleOpen}
        >
            {Trigger}
            <StyledMuiPopover
                {...muiPopoverProps}
                anchorPosition={{
                    top: anchorTop,
                    left: anchorLeft,
                }}
                anchorReference="anchorPosition"
                classes={{
                    paper: clsx('context-menu-paper', muiPopoverProps?.classes?.paper),
                }}
                open={visible && anchorTop > -1 && anchorLeft > -1}
                anchorEl={anchorEl.current}
                onClose={handleClose}
                onClick={(event) => {
                    event.stopPropagation();
                    if (_.isFunction(muiPopoverProps.onClick)) {
                        muiPopoverProps.onClick(event);
                    }
                }}
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

export default ContextMenu;
