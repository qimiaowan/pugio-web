import {
    Axios,
    AxiosResponse,
} from 'axios';
import { Injectable } from 'khamsa';
import { UtilsService } from '../utils/utils.service';
import querystring from 'querystring';
import omit from 'lodash/omit';
import isObjectLike from 'lodash/isObjectLike';
import isString from 'lodash/isString';
import {
    RequestConfig,
    RequestOptions,
    ResponseGetInstanceOptions,
} from './request.interface';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import isFunction from 'lodash/isFunction';

export class Request extends Axios {
    private utilsService: UtilsService;

    public constructor(options) {
        super(options);
    }

    public setUtilsService(utilsService: UtilsService) {
        this.utilsService = utilsService;
    }

    public request<T = any, R = AxiosResponse<T>, D = any>(config: RequestConfig<D> = {}): Promise<R> {
        const { query = {}, url = '' } = config;
        config.query = this.utilsService.transformDTOToDAO(query);
        const [pathname, urlSearch = ''] = url.split('?');
        const urlSearchParams = this.utilsService.transformURLSearchParamsToObject(new URLSearchParams(urlSearch));

        const queryObject = {
            ...urlSearchParams,
            ...query,
        };

        const newUrl = pathname +
            (
                Object.keys(queryObject).length > 0
                    ? `?${querystring.stringify(this.utilsService.transformDTOToDAO(queryObject))}`
                    : ''
            );

        config.url = newUrl;

        return super.request.call(this, omit(config, 'query'));
    };
}

@Injectable()
export class RequestService {
    private instance: Request;
    private json = true;
    private transformCase = true;

    public constructor(
        private readonly utilsService: UtilsService,
    ) {}

    public initialize(
        options: RequestOptions = {},
        instanceModifier?: (instance: Request) => void,
    ) {
        const {
            headers = {},
            requestConfig = {},
            json = true,
            transformCase = false,
        } = options;

        this.json = json;
        this.transformCase = transformCase;

        this.instance = new Request({
            responseEncoding: 'utf8',
            responseType: 'json',
            transformRequest: [
                (data) => {
                    if (isString(data)) {
                        return data;
                    }

                    if (isObject(data) || isObjectLike(data)) {
                        try {
                            return JSON.stringify(data);
                        } catch (e) {
                            return '';
                        }
                    }

                    return data;
                },
            ],
            ...requestConfig,
        });

        this.instance.setUtilsService(this.utilsService);

        this.instance.interceptors.request.use((config) => {
            return merge(config, {
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
            });
        });

        if (isFunction(instanceModifier)) {
            instanceModifier(this.instance);
        }
    }

    public getInstance(options: ResponseGetInstanceOptions = {}) {
        const {
            json: getInstanceJson = this.json,
            ...otherOptions
        } = options;

        const axiosOptions = otherOptions || {};
        const currentInstance = cloneDeep(this.instance);

        if (getInstanceJson) {
            const requestTransformers = currentInstance.defaults.transformRequest || [];
            const responseTransformers = currentInstance.defaults.transformResponse || [];

            currentInstance.defaults.transformResponse = [
                ...(
                    isArray(responseTransformers)
                        ? responseTransformers
                        : [responseTransformers]
                ),
                (data) => {
                    try {
                        return JSON.parse(data);
                    } catch (e) {
                        return data;
                    }
                },
                ...(
                    this.transformCase
                        ? [
                            (data) => {
                                return this.utilsService.transformDAOToDTO(data);
                            },
                        ]
                        : []
                ),
            ];

            currentInstance.defaults.transformRequest = [
                ...(
                    isArray(requestTransformers)
                        ? requestTransformers
                        : [requestTransformers]
                ),
                ...(
                    this.transformCase
                        ? [
                            (data) => {
                                return this.utilsService.transformDTOToDAO(data);
                            },
                        ]
                        : []
                ),
            ];
        }

        if (Object.keys(axiosOptions).length > 0) {
            Object.keys(axiosOptions).forEach((key) => {
                currentInstance.defaults[key] = axiosOptions[key];
            });
        }

        return currentInstance;
    }
}
