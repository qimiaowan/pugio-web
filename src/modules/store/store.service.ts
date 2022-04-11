import { Injectable } from 'khamsa';
import create from 'zustand';
import { Map } from 'immutable';
import { ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import {
    AppState,
    ChannelMetadata,
} from '@modules/store/store.interface';

@Injectable()
export class StoreService {
    public useStore = create<AppState>((set) => {
        return {
            channelTabs: Map({}),
            clientSidebarWidth: null,
            clientsDropdownOpen: false,
            pathnameReady: false,

            changeClientSidebarWidth: (width: number) => {
                set(() => ({ clientSidebarWidth: width }));
            },

            createTab: (clientId: string, appId: string, nodes: ReactNode, metadata: ChannelMetadata) => {
                const tabId = uuidv4();

                set((state) => {
                    const tabs = state.channelTabs.get(clientId) || [];

                    tabs.push({
                        id: tabId,
                        appId,
                        nodes,
                        metadata,
                    });

                    return {
                        channelTabs: state.channelTabs.set(clientId, tabs),
                    };
                });

                return tabId;
            },

            destroyTab: (clientId: string, tabId: string) => {
                set((state) => {
                    const tabs = state.channelTabs.get(clientId);

                    if (!_.isArray(tabs)) {
                        return {
                            channelTabs: state.channelTabs,
                        };
                    }

                    return {
                        channelTabs: state.channelTabs.set(
                            clientId,
                            tabs.filter((tab) => tab.id !== tabId),
                        ),
                    };
                });
            },

            switchClientsDropdownVisibility: (open?: boolean) => {
                set((state) => {
                    return {
                        clientsDropdownOpen: _.isBoolean(open) ? open : !state.clientsDropdownOpen,
                    };
                });
            },

            setPathnameReady() {
                set({ pathnameReady: true });
            },
        };
    });
}
