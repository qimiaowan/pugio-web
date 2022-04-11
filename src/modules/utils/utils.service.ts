import { Injectable } from 'khamsa';
import { CaseTransformerService } from '@pugio/case-transformer';
import _ from 'lodash';
import {
    ORIGIN,
    clientId,
} from '@/constants';

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
}
