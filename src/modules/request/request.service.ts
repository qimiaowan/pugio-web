import { Injectable } from 'khamsa';
import { UtilsService } from '../utils/utils.service';
import { RequestService as PugioRequest } from '@pugio/request';
import _ from 'lodash';

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

                instance.interceptors.response.use((response) => {
                    const responseStatus = response.status;
                    const responseContent = response.data;
                    const data = {
                        response: null,
                        error: null,
                    };

                    if (responseStatus >= 400) {
                        data.error = responseContent;
                        // TODO error handlers
                    } else {
                        data.response = responseContent;
                    }

                    return data;
                });
            },
        );
    }
}
