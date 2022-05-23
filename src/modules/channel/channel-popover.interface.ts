import { PopoverProps } from '@mui/material/Popover';
import {
    PropsWithChildren,
    MouseEvent,
    ReactNode,
} from 'react';
import { ChannelListProps } from '@modules/channel/channel-list.interface';

interface ChannelPopoverUtils {
    handleClose: () => void;
}

type ChannelListPropsCreator = (utils: ChannelPopoverUtils) => ChannelListProps;
type ChannelTriggerCreator = (data: {
    open: boolean;
    handleOpen: (event: MouseEvent<any>) => void;
}) => ReactNode;

export type ChannelPopoverProps = PropsWithChildren<{
    trigger: ChannelTriggerCreator;
    channelListProps: ChannelListProps | ChannelListPropsCreator;
    popoverProps?: Partial<PopoverProps>;
}>;
