import { Injectable } from 'khamsa';
import create from 'zustand';
import { Map } from 'immutable';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import {
    AppState,
    ChannelTab,
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

            createTab: (clientId: string, data: Omit<ChannelTab, 'tabId'>) => {
                const tabId = uuidv4();

                set((state) => {
                    const tabs = state.channelTabs.get(clientId) || [];

                    tabs.push({ tabId, ...data });

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
                            tabs.filter((tab) => tab.tabId !== tabId),
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
