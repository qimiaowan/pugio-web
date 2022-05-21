import { PopoverProps } from '@mui/material/Popover';
import {
    PropsWithChildren,
    ReactElement,
    MouseEvent,
} from 'react';
import { ChannelListProps } from '@modules/channel/channel-list.interface';

export type ChannelPopoverProps = PropsWithChildren<{
    trigger: ReactElement;
    channelListProps: ChannelListProps;
    popoverProps?: PopoverProps;
    onClick?: (event: MouseEvent<any>) => void;
}>;
