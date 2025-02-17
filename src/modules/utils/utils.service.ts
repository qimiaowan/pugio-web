import { Injectable } from 'khamsa';
import { CaseTransformerService } from '@pugio/case-transformer';
import _ from 'lodash';
import {
    InfiniteScrollHookData,
    PaginationResponseData,
    TDateRange,
} from '@modules/request/request.interface';
import { Location } from 'react-router-dom';
import {
    FC,
    useCallback,
    useEffect,
    useState,
} from 'react';
import {
    LoadedChannelProps,
    ObservableChannelConfig,
    ObservableChannelData,
} from '@modules/store/store.interface';
import { useInfiniteScroll } from 'ahooks';
import { InfiniteScrollOptions } from 'ahooks/lib/useInfiniteScroll/types';
import { Profile } from '@modules/profile/profile.interface';
import {
    useConfirmDialog,
    GlobalOptions,
    ConfirmOptions,
} from 'react-mui-confirm';
import { LocaleService } from '@modules/locale/locale.service';
import { ConfigService } from '@modules/config/config.service';

type EventListener = (data: any) => void;

export abstract class AbstractEventBus {
    public abstract onData(callbackFn: EventListener): Function;
    public abstract emit(data: any): void;
}

class EventBus extends AbstractEventBus implements AbstractEventBus  {
    private listeners: EventListener[] = [];

    public constructor() {
        super();
    }

    public onData(listener: EventListener) {
        if (_.isFunction(listener)) {
            this.listeners.push(listener);
        }

        return this.createDispose(listener);
    }

    public emit(data: any) {
        this.listeners.forEach((listener) => {
            if (_.isFunction(listener)) {
                listener(data);
            }
        });
    }

    private createDispose(listener: EventListener) {
        const dispose = () => {
            const listenerIndex = this.listeners.findIndex((currentListener) => currentListener === listener);

            if (listenerIndex > -1) {
                this.listeners.splice(listenerIndex, 1);
            }
        };

        return dispose.bind(this);
    }
}

@Injectable()
export class UtilsService extends CaseTransformerService {
    public constructor(
        private readonly localeService: LocaleService,
        private readonly configService: ConfigService,
    ) {
        super();
    }

    public generateOAuthState(redirectPath = '/') {
        const stateData = {
            clientId: this.configService.ACCOUNT_CENTER_OAUTH2_CLIENT_ID,
            vendor: {
                origin: this.configService.ORIGIN,
                checked_in_redirect_path: redirectPath,
            },
        };

        return window.btoa(JSON.stringify(stateData));
    }

    public getLoginUrl() {
        const locationHref = window.location.href;
        const params = new URLSearchParams();
        params.append('response_type', 'code');
        params.append('client_id', this.configService.ACCOUNT_CENTER_OAUTH2_CLIENT_ID);
        params.append('redirect_uri', 'https://account.lenconda.top/api/v1/auth/callback');
        params.append('scope', 'offline_access');
        params.append('state', this.generateOAuthState(locationHref));
        return `https://login2.lenconda.top/oauth2/authorize?${params.toString()}`;
    }

    public standardizeQuery(query: Record<string, any>) {
        if (!query) {
            return {};
        }

        return Object.keys(query).reduce((result, key) => {
            const value = query[key];

            if ((!_.isNumber(value) || !_.isBoolean(value)) && !value) {
                return result;
            }

            result[key] = value;

            return result;
        }, {});
    }

    public serializeDateRange(range: TDateRange): string {
        if (!range || !_.isArray(range)) {
            return '';
        }

        let startDate: Date;
        let endDate: Date;

        if (_.isDate(range[0])) {
            startDate = range[0];
        } else {
            startDate = new Date(0);
        }

        if (_.isDate(range[1])) {
            endDate = range[1];
        } else {
            endDate = new Date();
        }

        return [startDate.toISOString(), endDate.toISOString()].join('--');
    }

    public serializeLocation(location: Location) {
        if (!location) {
            return '';
        }

        const {
            pathname = '/',
            hash = '',
            search = '',
        } = location;

        return `${pathname}${search}${hash}`;
    }

    public async loadChannelBundle(url: string, channelId: string): Promise<FC<LoadedChannelProps>> {
        const amdRequire = window.require as Function;

        return new Promise((resolve, reject) => {
            try {
                amdRequire(
                    [url],
                    (mod) => {
                        const channelBundle = mod.default || mod;

                        if (!channelBundle || typeof channelBundle !== 'function') {
                            reject(new Error(`Channel bundle may have a wrong type: ${typeof channelBundle}`));
                        }

                        resolve(channelBundle);
                    },
                    (error) => {
                        if (error) {
                            reject(error);
                        }
                    },
                );
            } catch (e) {
                reject(new Error(`Cannot load channel bundle '${channelId}'`));
            }
        });
    }

    public parseSelectedTabId(literal: string) {
        if (!literal || typeof literal !== 'string') {
            return null;
        }

        const [tabId, metadataLiteral] = literal.split(':');

        return {
            tabId,
            metadata: metadataLiteral
                ? metadataLiteral.split(/,\s+/g)
                : [],
        };
    }

    public useLoadMore<DataType = any>(
        service: (data: InfiniteScrollHookData<DataType>) => Promise<PaginationResponseData<DataType>>,
        options: InfiniteScrollOptions<InfiniteScrollHookData<DataType>>,
    ) {
        const [error, setError] = useState<Error>(null);

        const data = useInfiniteScroll(
            async (data) => {
                const response = await service(data);
                return {
                    list: response?.response?.items || [],
                    ...(_.omit(_.get(response, 'response'), ['items', 'lastCursor']) || {}),
                    lastCursor: _.get(Array.from(response?.response?.items || []).pop(), 'id') || null,
                };
            },
            {
                ...({
                    isNoMore: (data) => data?.remains === 0,
                    onError: (error) => setError(error),
                }),
                ...(options || {}),
            },
        );

        return {
            ...data,
            error,
        };
    }

    public calculateItemWidth(baselineWidth: number, width: number) {
        if (!baselineWidth || !width) {
            return 0;
        }

        const remainder = baselineWidth % width;

        if (remainder === 0) {
            return width;
        }

        const count = Math.ceil(baselineWidth / width);

        return baselineWidth / count;
    }

    public generateUserDescription(profile: Profile) {
        const {
            fullName,
            firstName,
            middleName,
            lastName,
            email,
            picture = this.configService.DEFAULT_PICTURE_URL,
        } = profile;

        const result = {
            avatar: picture,
            title: '',
            extraTitle: '',
            subTitle: email,
        };

        const name = [
            firstName,
            middleName,
            lastName,
        ].filter((nameSegment) => Boolean(nameSegment)).join('.');

        if (fullName) {
            result.title = fullName;
            result.extraTitle = name;
        } else {
            result.title = name;
        }

        return result;
    }

    public useConfirm() {
        const getConfirmLocaleText = this.localeService.useLocaleContext('components.confirm');
        const createConfirm = useConfirmDialog();

        const confirm = useCallback((options: ConfirmOptions & GlobalOptions) => {
            createConfirm({
                confirmButtonText: getConfirmLocaleText('ok'),
                cancelButtonText: getConfirmLocaleText('cancel'),
                title: getConfirmLocaleText('confirm'),
                ...options,
                dialogContentProps: {
                    ...(options?.dialogContentProps || {}),
                    sx: {
                        paddingBottom: 4,
                        ...(options?.dialogContentProps?.sx || {}),
                        '&, *': {
                            userSelect: 'none',
                        },
                    },
                },
                dialogTitleProps: {
                    ...(options?.dialogTitleProps || {}),
                    sx: {
                        '&+.MuiDialogContent-root': {
                            paddingTop: 4,
                        },
                        ...(options?.dialogTitleProps?.sx || {}),
                        '&, *': {
                            userSelect: 'none',
                        },
                    },
                },
            });
        }, [getConfirmLocaleText, createConfirm]);

        return confirm;
    }

    public createEventBus() {
        return new EventBus();
    }

    public useChannelConfig(): ObservableChannelData {
        const [channelConfig, setChannelConfig] = useState<ObservableChannelData>({
            width: undefined,
            height: undefined,
            locale: undefined,
            mode: 'light',
            status: 'initializing',
            dispose: _.noop,
        });

        useEffect(() => {
            if (window[this.configService.WORKSTATION_BUS_ID]) {
                const dispose = window[this.configService.WORKSTATION_BUS_ID].onData((config: ObservableChannelConfig) => {
                    setChannelConfig({
                        ...config,
                        dispose,
                        status: 'updated',
                    });
                });

                return () => {
                    dispose();
                };
            }
        }, [window[this.configService.WORKSTATION_BUS_ID]]);

        return channelConfig;
    }

    public getChannelName(defaultName: string, locale: string, rawTranslationMap = '{}') {
        try {
            const translationMap = JSON.parse(rawTranslationMap) || {};
            const name = translationMap[locale];

            if (name) {
                return name;
            }

            return defaultName;
        } catch (e) {
            return defaultName;
        }
    }
}
