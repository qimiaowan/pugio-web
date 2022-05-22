import Popover from '@mui/material/Popover';
import {
    cloneElement,
    FC,
    useState,
    MouseEvent,
} from 'react';
import { ChannelPopoverProps } from '@modules/channel/channel-popover.interface';
import _ from 'lodash';
import { InjectedComponentProps } from 'khamsa';
import { ChannelListProps } from '@modules/channel/channel-list.interface';
import { ChannelListComponent } from '@modules/channel/channel-list.component';

const ChannelPopover: FC<InjectedComponentProps<ChannelPopoverProps>> = ({
    trigger,
    declarations,
    channelListProps,
    onClick,
}) => {
    const ChannelList = declarations.get<FC<ChannelListProps>>(ChannelListComponent);

    const [anchorEl, setAnchorEl] = useState<any | null>(null);

    const handleClick = (event: MouseEvent<any>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            {
                cloneElement(trigger, {
                    onClick: (event) => {
                        if (_.isFunction(onClick)) {
                            onClick(event);
                        }
                        handleClick(event);
                    },
                })
            }
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
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
        </>
    );
};

export default ChannelPopover;
