import { PopoverProps } from '@mui/material/Popover';
import {
    PropsWithChildren,
    ReactElement,
    MouseEvent,
} from 'react';
import { ChannelListProps } from '@modules/channel/channel-list.interface';

interface ChannelPopoverUtils {
    handleClose: () => void;
}

type ChannelListPropsCreator = (utils: ChannelPopoverUtils) => ChannelListProps;

export type ChannelPopoverProps = PropsWithChildren<{
    trigger: ReactElement;
    channelListProps: ChannelListProps | ChannelListPropsCreator;
    popoverProps?: Partial<PopoverProps>;
    onClick?: (event: MouseEvent<any>) => void;
}>;
