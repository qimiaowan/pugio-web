import { Injectable } from 'khamsa';
import create from 'zustand';
import {
    Map,
    Set,
} from 'immutable';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import {
    AppState,
    ChannelTab,
    TabData,
} from '@modules/store/store.interface';
import { Profile } from '@modules/profile/profile.interface';
import { UtilsService } from '@modules/utils/utils.service';

@Injectable()
export class StoreService {
    public useStore = create<AppState>((set) => {
        return {
            userProfile: null,
            channelTabs: Map<string, Set<ChannelTab>>({}),
            clientSidebarWidth: null,
            clientsDropdownOpen: false,
            pathnameReady: false,
            appNavbarHeight: 48,
            controlsWrapperHeight: 0,
            tabsWrapperHeight: 0,
            selectedTabMap: Map<string, string>({}),
            tabsScrollMap: Map<string, number>({}),

            setClientSidebarWidth: (width: number) => {
                set(() => ({ clientSidebarWidth: width }));
            },

            createTab: (clientId: string, data: TabData = {}) => {
                const tabId = uuidv4();

                set((state) => {
                    const channelTabData: ChannelTab = {
                        tabId,
                        ...data,
                        loading: false,
                    };

                    if (!state.channelTabs.get(clientId)) {
                        const tabs = Set<ChannelTab>().add(channelTabData);
                        return {
                            channelTabs: state.channelTabs.set(clientId, tabs),
                        };
                    } else {
                        const tabs = state.channelTabs.get(clientId).add(channelTabData);

                        return {
                            channelTabs: state.channelTabs.set(clientId, tabs),
                        };
                    }
                });

                return tabId;
            },

            updateTab: (clientId: string, tabId: string, updates: Partial<TabData>) => {
                set((state) => {
                    const client = state.channelTabs.get(clientId);

                    if (!client) {
                        return {
                            channelTabs: state.channelTabs,
                        };
                    }

                    return {
                        channelTabs: state.channelTabs.set(
                            clientId,
                            client.map((clientItem) => {
                                if (clientItem.tabId === tabId) {
                                    return {
                                        ...clientItem,
                                        ..._.pick(updates, [
                                            'nodes',
                                            'loading',
                                            'errored',
                                            'data',
                                            'lifecycle',
                                            'channelId',
                                        ]),
                                    };
                                }

                                return clientItem;
                            }),
                        ),
                    };
                });
            },

            destroyTab: (clientId: string, tabIdLiteral: string) => {
                const { tabId } = this.utilsService.parseSelectedTabId(tabIdLiteral);

                set((state) => {
                    const tabs = state.channelTabs.get(clientId);

                    if (!tabs) {
                        return {
                            channelTabs: state.channelTabs,
                            selectedTabMap: state.selectedTabMap,
                        };
                    }

                    const newTabs = tabs.filter((tab) => tab.tabId !== tabId);

                    return {
                        channelTabs: state.channelTabs.set(
                            clientId,
                            newTabs,
                        ),
                        selectedTabMap: state.selectedTabMap.set(
                            clientId,
                            newTabs?.last()?.tabId || null,
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

            setPathnameReady: () => {
                set({ pathnameReady: true });
            },

            setControlsWrapperHeight: (height: number) => {
                set({ controlsWrapperHeight: height });
            },

            setTabsWrapperHeight: (height: number) => {
                set({ tabsWrapperHeight: height });
            },

            setSelectedTab: (clientId: string, tabId: string) => {
                set((state) => {
                    return {
                        selectedTabMap: state.selectedTabMap.set(clientId, tabId),
                    };
                });
            },

            setUserProfile: (profile: Profile) => {
                set({ userProfile: profile });
            },

            updateTabsScrollOffset: (clientId: string, offset: number) => {
                if (!_.isNumber(offset) || !clientId) {
                    return;
                }

                set((state) => {
                    return {
                        tabsScrollMap: state.tabsScrollMap.set(clientId, offset),
                    };
                });
            },
        };
    });

    public constructor(
        private readonly utilsService: UtilsService,
    ) {}
}
