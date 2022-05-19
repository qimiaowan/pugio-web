import { Channel } from '@modules/channel/channel.interface';
import { BoxProps } from '@mui/material/Box';

export interface ChannelListItemProps extends BoxProps {
    data: Channel;
    width: number;
    builtIn?: boolean;
    onDelete?: (data: Channel) => void;
}
