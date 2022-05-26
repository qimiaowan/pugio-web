import { PopoverProps } from '@mui/material/Popover';
import {
    PropsWithChildren,
    MouseEvent,
    FC,
} from 'react';
import { ChannelListProps } from '@modules/channel/channel-list.interface';

interface ChannelPopoverUtils {
    handleClose: () => void;
}

type ChannelListPropsCreator = (utils: ChannelPopoverUtils) => ChannelListProps;

interface TriggerProps {
    open: boolean;
    handleOpen: (event: MouseEvent<any>) => void;
}

export type ChannelPopoverProps = PropsWithChildren<{
    Trigger: FC<TriggerProps>;
    channelListProps: ChannelListProps | ChannelListPropsCreator;
    popoverProps?: Partial<PopoverProps>;
}>;
