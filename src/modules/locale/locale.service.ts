import {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';
import { Injectable } from 'khamsa';
import _ from 'lodash';
import Mustache from 'mustache';
import {
    LocaleListItem,
    LocaleContextProps,
} from '@modules/locale/locale.interface';

@Injectable()
export class LocaleService {
    private LocaleContext = createContext<LocaleContextProps>(null);

    public getContext() {
        return this.LocaleContext;
    }

    public useContextLocale() {
        const { locale } = useContext(this.LocaleContext);
        return locale;
    }

    public useLocaleMap(locale = 'en_US') {
        const [localeTextMap, setLocaleTextMap] = useState(null);
        const [defaultLocaleTextMap, setDefaultLocaleTextMap] = useState(null);

        useEffect(() => {
            fetch('/i18n/locales/en_US.json')
                .then((res) => res.json())
                .then((enUsLocaleTextMap) => setDefaultLocaleTextMap(enUsLocaleTextMap));
        }, []);

        useEffect(() => {
            if (defaultLocaleTextMap) {
                if (locale === 'en_US') {
                    setLocaleTextMap(defaultLocaleTextMap);
                } else {
                    fetch(`/i18n/locales/${locale}.json`)
                        .then((res) => res.json())
                        .then((localeTextMap) => {
                            setLocaleTextMap(_.merge(_.cloneDeep(defaultLocaleTextMap), localeTextMap));
                        })
                        .catch(() => setLocaleTextMap(defaultLocaleTextMap));
                }
            }
        }, [locale, defaultLocaleTextMap]);

        return localeTextMap;
    }

    public useLocaleContext(basePathname = '') {
        const basePathnameSegments = basePathname.split('.');
        const { localeTextMap } = useContext(this.LocaleContext);
        const [localeTextGetter, setLocaleTextGetter] = useState<Function>(() => _.noop);

        useEffect(() => {
            const newLocaleTextGetter = (pathname: string, props: any = {}) => {
                const localeText = _.get(
                    localeTextMap,
                    basePathnameSegments.concat(
                        pathname.split('.'),
                    ).filter((segment) => !!segment).join('.'),
                ) || '';

                if (!localeText || !_.isString(localeText)) {
                    return '';
                }

                try {
                    const parsedLocaleText = Mustache.render(localeText, props);
                    return parsedLocaleText;
                } catch (e) {
                    return localeText;
                }
            };
            setLocaleTextGetter(() => newLocaleTextGetter);
        }, [localeTextMap]);

        return localeTextGetter;
    }

    public async getLocales(): Promise<LocaleListItem[]> {
        try {
            const manifestInfo = await fetch('/manifest.json').then((res) => res.json());

            if (!manifestInfo || !manifestInfo.locales || !_.isArray(manifestInfo.locales)) {
                return [];
            } else {
                return _.get(manifestInfo, 'locales');
            }
        } catch (e) {
            return [];
        }
    }

    public parseChannelTranslationMap(rawTranslationMap: string) {
        if (!_.isString(rawTranslationMap)) {
            return {};
        }

        try {
            const translationMap = JSON.parse(rawTranslationMap) || {};
            return translationMap;
        } catch (e) {
            return {};
        }
    }

    public useChannelLocaleContext(locale = 'en_US', basePathname = '') {
        const basePathnameSegments = basePathname.split('.');
        const {
            localeTextMap: translationMap,
        } = useContext(this.LocaleContext);
        const [localeTextGetter, setLocaleTextGetter] = useState<Function>(() => _.noop);
        const [localeTextMap, setLocaleTextMap] = useState<Record<string, any>>({});

        useEffect(() => {
            const defaultLocaleTextMap = translationMap['default'] || translationMap['en_US'] || {};
            const currentLocaleTextMap = translationMap[locale] || {};
            setLocaleTextMap(_.merge(defaultLocaleTextMap, currentLocaleTextMap));
        }, [locale, translationMap]);

        useEffect(() => {
            const newLocaleTextGetter = (pathname: string, props: any = {}) => {
                const localeText = _.get(
                    localeTextMap,
                    basePathnameSegments.concat(
                        pathname.split('.'),
                    ).filter((segment) => !!segment).join('.'),
                ) || '';

                if (!localeText || !_.isString(localeText)) {
                    return '';
                }

                try {
                    const parsedLocaleText = Mustache.render(localeText, props);
                    return parsedLocaleText;
                } catch (e) {
                    return localeText;
                }
            };
            setLocaleTextGetter(() => newLocaleTextGetter);
        }, [localeTextMap]);

        return localeTextGetter;
    }
}
