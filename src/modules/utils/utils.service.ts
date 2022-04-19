import { Injectable } from 'khamsa';
import { CaseTransformerService } from '@pugio/case-transformer';
import _ from 'lodash';
import {
    ORIGIN,
    clientId,
} from '@/constants';
import { TDateRange } from '@modules/request/request.interface';
import { Location } from 'react-router-dom';
import { FC } from 'react';
import { LoadedChannelProps } from '@modules/store/store.interface';

@Injectable()
export class UtilsService extends CaseTransformerService {
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
                amdRequire(url, (channelBundle) => {
                    if (!channelBundle || typeof channelBundle !== 'function') {
                        reject(new Error(`Channel bundle may have a wrong type: ${typeof channelBundle}`));
                    }

                    resolve(channelBundle);
                });
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
}
