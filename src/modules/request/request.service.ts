import { Injectable } from 'khamsa';
import { UtilsService } from '@modules/utils/utils.service';
import { RequestService as PugioRequest } from '@pugio/request';
import _ from 'lodash';
import { ResponseGetInstanceOptions } from '@pugio/types';

@Injectable()
export class RequestService {
    private request: PugioRequest = new PugioRequest();

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
                    const token = localStorage.getItem('token') || sessionStorage.getItem('token') as string;

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
}
