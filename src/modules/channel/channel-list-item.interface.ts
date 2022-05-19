import { MouseEventHandler } from 'react';
import { Channel } from '@modules/channel/channel.interface';
import { BoxProps } from '@mui/material/Box';
import { IconButtonProps } from '@mui/material/IconButton';

export type ChannelListItemMode = 'app-entry' | 'list-item';

export interface ChannelListItemMenuItem {
    icon: string;
    title: string;
    onClick?: MouseEventHandler<HTMLDivElement>;
}

export interface ChannelListItemProps extends BoxProps {
    data: Channel;
    width: number;
    mode?: ChannelListItemMode;
    builtIn?: boolean;
    menu?: ChannelListItemMenuItem[];
}

export interface ChannelListItemMenuProps {
    menu?: ChannelListItemMenuItem[];
    IconButtonProps?: IconButtonProps;
}
