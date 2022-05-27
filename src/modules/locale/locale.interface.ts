export interface LocaleListItem {
    id: string;
    title: string;
}

export interface LocaleContextProps {
    localeTextMap: Record<string, any>;
    locale: string;
}
