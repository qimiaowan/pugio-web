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
    id: string;
    appId: string;
    nodes: ReactNode;
    metadata: ChannelMetadata;
}

export interface AppState {
    channelTabs: Map<string, ChannelTab[]>;
    clientSidebarWidth: number;
    clientsDropdownOpen: boolean;
    pathnameReady: boolean;
    changeClientSidebarWidth: (width: number) => void;
    createTab: (clientId: string, appId: string, nodes: ReactNode, metadata: ChannelMetadata) => string;
    destroyTab: (clientId: string, tabId: string) => void;
    switchClientsDropdownVisibility: (open?: boolean) => void;
    setPathnameReady: () => void;
}
