import {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';
import { Injectable } from 'khamsa';
import isString from 'lodash/isString';
import get from 'lodash/get';
import merge from 'lodash/merge';
import noop from 'lodash/noop';
import Mustache from 'mustache';

@Injectable()
export class LocaleService {
    private LocaleContext = createContext(null);

    public getContext() {
        return this.LocaleContext;
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
                            setLocaleTextMap(merge(defaultLocaleTextMap, localeTextMap));
                        });
                }
            }
        }, [locale, defaultLocaleTextMap]);

        return localeTextMap;
    }

    public useLocaleContext() {
        const localeTextMap = useContext(this.LocaleContext);
        const [localeTextGetter, setLocaleTextGetter] = useState<Function>(() => noop);

        useEffect(() => {
            const newLocaleTextGetter = (pathname: string, props?: any) => {
                const localeText = get(localeTextMap, pathname) || '';

                if (!localeText || !isString(localeText)) {
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
