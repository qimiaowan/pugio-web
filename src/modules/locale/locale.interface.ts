export interface LocaleListItem {
    id: string;
    title: string;
}

export interface LocaleMenuProps {
    locales: LocaleListItem[];
    selectedLocaleId?: string;
    onLocaleChange?: (localeItem: LocaleListItem) => void;
}
