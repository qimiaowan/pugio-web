import { ReactNode } from 'react';
import { Map } from 'immutable';

export interface ClientTab {
    id: string;
    appId: string;
    nodes: ReactNode;
}

export interface AppState {
    clientTabs: Map<string, ClientTab[]>;
    clientSidebarWidth: number;
    clientsDropdownOpen: boolean;
    changeClientSidebarWidth: (width: number) => void;
    createTab: (clientId: string, appId: string, nodes: ReactNode) => string;
    destroyTab: (clientId: string, tabId: string) => void;
    switchClientsDropdownVisibility: (open?: boolean) => void;
}
