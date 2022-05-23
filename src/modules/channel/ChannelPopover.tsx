import Popover from '@mui/material/Popover';
import {
    FC,
    useState,
    MouseEvent,
} from 'react';
import { ChannelPopoverProps } from '@modules/channel/channel-popover.interface';
import _ from 'lodash';
import { InjectedComponentProps } from 'khamsa';
import { ChannelListProps } from '@modules/channel/channel-list.interface';
import { ChannelListComponent } from '@modules/channel/channel-list.component';
import Box from '@mui/material/Box';

const ChannelPopover: FC<InjectedComponentProps<ChannelPopoverProps>> = ({
    trigger,
    declarations,
    channelListProps,
    popoverProps = {},
}) => {
    const ChannelList = declarations.get<FC<ChannelListProps>>(ChannelListComponent);

    const [anchorEl, setAnchorEl] = useState<any | null>(null);

    const open = Boolean(anchorEl);
    const id = open ? Math.random().toString(32).slice(2) : undefined;

    const handleClick = (event: MouseEvent<any>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box>
            {_.isFunction(trigger) && trigger({ open, handleOpen: handleClick })}
            <Popover
                id={id}
                open={open}
                anchorEl={() => anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                {...popoverProps}
            >
                <ChannelList
                    {
                        ...(
                            _.isFunction(channelListProps)
                                ? channelListProps({ handleClose })
                                : channelListProps
                        )
                    }
                />
            </Popover>
        </Box>
    );
};

export default ChannelPopover;
