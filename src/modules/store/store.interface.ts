import { ReactNode } from 'react';
import { Map } from 'immutable';

export interface ClientTab {
    id: string;
    appId: string;
    nodes: ReactNode;
}

export interface AppState {
    clientTabs: Map<string, ClientTab[]>;
    createTab: (clientId: string, appId: string, nodes: ReactNode) => string;
    destroyTab: (clientId: string, tabId: string) => void;
}
