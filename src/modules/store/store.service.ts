import { Injectable } from 'khamsa';
import create from 'zustand';
import { AppState } from './store.interface';
import { Map } from 'immutable';
import isArray from 'lodash/isArray';
import { ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StoreService {
    public useStore = create<AppState>((set) => {
        return {
            clientTabs: Map({}),

            createTab: (clientId: string, appId: string, nodes: ReactNode) => {
                const tabId = uuidv4();

                set((state) => {
                    const tabs = state.clientTabs.get(clientId) || [];

                    tabs.push({
                        id: tabId,
                        appId,
                        nodes,
                    });

                    return {
                        clientTabs: state.clientTabs.set(clientId, tabs),
                    };
                });

                return tabId;
            },

            destroyTab: (clientId: string, tabId: string) => {
                set((state) => {
                    const tabs = state.clientTabs.get(clientId);

                    if (!isArray(tabs)) {
                        return {
                            clientTabs: state.clientTabs,
                        };
                    }

                    return {
                        clientTabs: state.clientTabs.set(
                            clientId,
                            tabs.filter((tab) => tab.id !== tabId),
                        ),
                    };
                });
            },
        };
    });
}
