export interface ClientWorkstationTabsProps {
    headerWidth?: number;
    panelHeight?: number;
    selectedTabId?: string;
    selectedTabMetadata?: any;
    onGoHome?: (tabId: string) => void;
    onSelectedTabIdChange?: (tabId: string) => void;
}
