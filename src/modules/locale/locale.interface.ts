export interface LocaleListItem {
    id: string;
    title: string;
}

export interface LocaleMenuProps {
    locales: LocaleListItem[];
    onLocaleChange?: (localeItem: LocaleListItem) => void;
}
