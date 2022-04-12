import { ReactNode } from 'react';
import {
    Map,
    Set,
} from 'immutable';
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

export type TabData = Omit<ChannelTab, 'tabId'>;

export interface AppState {
    channelTabs: Map<string, Set<ChannelTab>>;
    clientSidebarWidth: number;
    clientsDropdownOpen: boolean;
    pathnameReady: boolean;
    appNavbarHeight: number;
    controlsWrapperHeight: number;
    tabsWrapperHeight: number;
    setClientSidebarWidth: (width: number) => void;
    createTab: (clientId: string, data: TabData) => string;
    updateTab: (clientId: string, tabId: string, updates: Partial<TabData>) => void;
    destroyTab: (clientId: string, tabId: string) => void;
    switchClientsDropdownVisibility: (open?: boolean) => void;
    setPathnameReady: () => void;
    setControlsWrapperHeight: (height: number) => void;
    setTabsWrapperHeight: (height: number) => void;
}
