import { Injectable } from 'khamsa';
import { CaseTransformerService } from '@pugio/case-transformer';
import _ from 'lodash';
import {
    ORIGIN,
    clientId,
    DEFAULT_PICTURE_URL,
} from '@/constants';
import {
    InfiniteScrollHookData,
    PaginationResponseData,
    TDateRange,
} from '@modules/request/request.interface';
import { Location } from 'react-router-dom';
import {
    FC,
    useCallback,
} from 'react';
import { LoadedChannelProps } from '@modules/store/store.interface';
import { useInfiniteScroll } from 'ahooks';
import { InfiniteScrollOptions } from 'ahooks/lib/useInfiniteScroll/types';
import { Profile } from '@modules/profile/profile.interface';
import {
    useConfirmDialog,
    GlobalOptions,
    ConfirmOptions,
} from 'react-mui-confirm';
import { LocaleService } from '@modules/locale/locale.service';

@Injectable()
export class UtilsService extends CaseTransformerService {
    public constructor(
        private readonly localeService: LocaleService,
    ) {
        super();
    }

    public generateOAuthState(redirectPath = '/') {
        const stateData = {
            clientId,
            vendor: {
                origin: ORIGIN,
                checked_in_redirect_path: redirectPath,
            },
        };

        return window.btoa(JSON.stringify(stateData));
    }

    public getLoginUrl() {
        const locationHref = window.location.href;
        const params = new URLSearchParams();
        params.append('response_type', 'code');
        params.append('client_id', clientId);
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
        return useInfiniteScroll(
            async (data) => {
                const response = await service(data);
                return {
                    list: response?.response?.items || [],
                    ...(_.omit(_.get(response, 'response'), ['items', 'lastCursor']) || {}),
                    lastCursor: _.get(Array.from(response?.response?.items || []).pop(), 'id') || null,
                };
            },
            _.merge(
                {
                    isNoMore: (data) => data?.remains === 0,
                } as InfiniteScrollOptions<InfiniteScrollHookData<DataType>>,
                options,
            ),
        );
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
            picture = DEFAULT_PICTURE_URL,
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
            });
        }, [getConfirmLocaleText, createConfirm]);

        return confirm;
    }
}
