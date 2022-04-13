import { ChannelTab } from '@modules/store/store.interface';
import { BoxProps } from '@mui/material/Box';
import { FC } from 'react';
import { Profile } from '@modules/profile/profile.interface';

export interface ChannelPanelProps extends BoxProps, ChannelTab {
    startupTab?: boolean;
    onLoadBundleStart?: () => void;
    onLoadBundleEnd?: (bundle?: FC<ChannelPanelProps>, error?: Error) => void;
}

export interface Channel {
    id: string;
    name: string;
    packageName: string;
    avatar: string;
    bundleUrl: string;
    registry: string;
    apiPrefix: string;
    status: number;
    creator: Profile;
    createdAt: string;
    updatedAt: string;
    description?: string;
}
