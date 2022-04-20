import { Channel } from '@modules/channel/channel.interface';
import { BoxProps } from '@mui/material/Box';

export interface ChannelListProps {
    clientId: string;
    width: number;
    height: number;
    onSelectChannel?: (channelId: string) => void;
}

export interface ChannelListItemProps extends BoxProps {
    data: Channel;
    onDelete?: (data: Channel) => void;
}
