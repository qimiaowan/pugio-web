import { MouseEventHandler } from 'react';
import { Channel } from '@modules/channel/channel.interface';
import { BoxProps } from '@mui/material/Box';

export type ChannelListItemMode = 'app-entry' | 'list-item';

export interface ChannelListItemMenuItem {
    icon: string;
    onClick?: (event: MouseEventHandler<HTMLButtonElement>) => void;
}

export interface ChannelListItemProps extends BoxProps {
    data: Channel;
    width: number;
    mode?: ChannelListItemMode;
    builtIn?: boolean;
    menu?: ChannelListItemMenuItem[];
}
