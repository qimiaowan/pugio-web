import { Injectable } from 'khamsa';
import { UtilsService } from '@modules/utils/utils.service';
import { RequestService as PugioRequest } from '@pugio/request';
import _ from 'lodash';
import { ResponseGetInstanceOptions } from '@pugio/types';
import {
    RefreshTokenRequestOptions,
    RefreshTokenResponseData,
    Response,
} from '@modules/request/request.interface';
import qs from 'qs';

@Injectable()
export class RequestService {
    private request: PugioRequest = new PugioRequest();
    private REFRESH_TOKEN_URL = 'https://account.lenconda.top/api/v1/vendor/refresh_token';

    public constructor(
        private readonly utilsService: UtilsService,
    ) {
        this.request.initialize(
            {
                headers: {},
                transformCase: true,
                requestConfig: {
                    baseURL: '/api/v1',
                },
            },
            (instance) => {
                const defaultRequestTransformers = instance.defaults.transformRequest || [];

                instance.defaults.transformRequest = [
                    (data) => {
                        return this.utilsService.transformDTOToDAO(data);
                    },
                    ...(
                        _.isArray(defaultRequestTransformers)
                            ? defaultRequestTransformers
                            : [defaultRequestTransformers]
                    ),
                ];

                instance.interceptors.request.use((config) => {
                    const token = localStorage.getItem('ACCESS_TOKEN') as string;
                    const refreshToken = localStorage.getItem('REFRESH_TOKEN') as string;
                    let expireDateTimestamp: number;

                    if (config.url) {
                        const [prefixedUrl, searchString] = config.url.split('?');

                        if (searchString) {
                            const queryObject = qs.parse(searchString);
                            const standardizedQueryObject = this.utilsService.standardizeQuery(queryObject);
                            const standardizedSearchString = qs.stringify(standardizedQueryObject);
                            config.url = `${prefixedUrl}?${standardizedSearchString}`;
                        }
                    }

                    if (_.isString(localStorage.getItem('ACCESS_TOKEN_EXPIRE_DATE'))) {
                        try {
                            expireDateTimestamp = Date.parse(localStorage.getItem('ACCESS_TOKEN_EXPIRE_DATE'));
                        } catch (e) {}
                    }

                    if (
                        _.isNumber(expireDateTimestamp) &&
                        _.isString(refreshToken) &&
                        config.url !== this.REFRESH_TOKEN_URL
                    ) {
                        if (expireDateTimestamp - Date.now() <= 60000) {
                            this.refreshToken({ refreshToken }).then((response) => {
                                if (response?.response) {
                                    this.updateToken(response.response);
                                }
                            });
                        }
                    }

                    if (token) {
                        config.headers = {
                            Authorization: `Bearer ${token}`,
                        };
                    }

                    return config;
                });

                instance.interceptors.response.use((response) => {
                    const responseStatus = response.status;
                    const responseContent = response.data;
                    const data = {
                        response: null,
                        error: null,
                    };

                    if (responseStatus >= 400) {
                        data.error = responseContent;

                        if (responseStatus === 401) {
                            window.location.href = this.utilsService.getLoginUrl();
                        }
                    } else {
                        data.response = responseContent;
                    }

                    return data;
                });
            },
        );
    }

    public getInstance(options: ResponseGetInstanceOptions = {}) {
        return this.request.getInstance(options);
    }

    public async refreshToken(options: RefreshTokenRequestOptions): Promise<Response<RefreshTokenResponseData>> {
        return this
            .getInstance()
            .request({
                url: this.REFRESH_TOKEN_URL,
                method: 'post',
                data: {
                    refreshToken: options.refreshToken,
                    clientId: 'deef165b-9e97-4eda-ae4e-cfcc9480b1ea',
                },
            });
    }

    public updateToken(data: RefreshTokenResponseData) {
        const {
            accessToken,
            refreshToken,
            expiresIn,
        } = data;

        const expireDate = new Date(Date.now() + expiresIn * 1000);

        localStorage.setItem('ACCESS_TOKEN', accessToken);
        localStorage.setItem('REFRESH_TOKEN', refreshToken);
        localStorage.setItem('ACCESS_TOKEN_EXPIRE_DATE', expireDate.toISOString());
    }
}
