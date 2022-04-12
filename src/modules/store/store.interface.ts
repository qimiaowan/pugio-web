import { ReactNode } from 'react';
import { Map } from 'immutable';
import {
    Client,
    QueryClientsResponseData,
} from '@modules/clients/clients.interface';
import { Profile } from '@modules/profile/profile.interface';
import { Location } from 'react-router-dom';

export interface ChannelMetadata {
    client: Client;
    relation: Omit<QueryClientsResponseData, 'client'>;
    user: Profile;
    location: Location;
}

export interface ChannelTab {
    tabId: string;
    channelId: string;
    url: string;
    metadata: ChannelMetadata;
    nodes?: ReactNode;
    loading?: boolean;
    errored?: boolean;
}

export interface AppState {
    channelTabs: Map<string, ChannelTab[]>;
    clientSidebarWidth: number;
    clientsDropdownOpen: boolean;
    pathnameReady: boolean;
    changeClientSidebarWidth: (width: number) => void;
    createTab: (clientId: string, data: Omit<ChannelTab, 'tabId'>) => string;
    destroyTab: (clientId: string, tabId: string) => void;
    switchClientsDropdownVisibility: (open?: boolean) => void;
    setPathnameReady: () => void;
}
