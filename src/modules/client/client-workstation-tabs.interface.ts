import {
    ChannelTab,
    TabData,
} from '@modules/store/store.interface';

export interface ClientWorkstationTabsProps {
    headerWidth?: number;
    panelHeight?: number;
    selectedTabId?: string;
    selectedTabMetadata?: string[];
    tabs?: ChannelTab[];
    onGoHome?: (tabId: string) => void;
    onSelectedTabIdChange?: (tabId: string) => void;
    onCreateTab?: (clientId: string, data?: TabData) => void;
}
