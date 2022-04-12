import { ChannelTab } from '@modules/store/store.interface';
import { BoxProps } from '@mui/material/Box';
import { FC } from 'react';

export interface ChannelPanelProps extends BoxProps, ChannelTab {
    startupTab?: boolean;
    onLoadBundleStart?: () => void;
    onLoadBundleEnd?: (bundle?: FC<ChannelPanelProps>, error?: Error) => void;
}
