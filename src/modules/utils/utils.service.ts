import { Injectable } from 'khamsa';
import {
    CaseStyleType,
    DataType,
} from './utils.interface';
import isNumber from 'lodash/isNumber';
import isBoolean from 'lodash/isBoolean';
import isArray from 'lodash/isArray';
import isDate from 'lodash/isDate';
import isObject from 'lodash/isObject';
import isObjectLike from 'lodash/isObjectLike';
import camelCase from 'lodash/camelCase';
import kebabCase from 'lodash/kebabCase';
import snakeCase from 'lodash/snakeCase';
import cloneDeep from 'lodash/cloneDeep';
import isString from 'lodash/isString';
import isPlainObject from 'lodash/isPlainObject';

@Injectable()
export class UtilsService {
    public transformCaseStyle = <T extends DataType, R extends T | DataType>(
        data: Partial<T>,
        targetCaseStyleType: CaseStyleType,
    ): R => {
        if (isNumber(data) && data === 0) {
            return data as any;
        }

        if (isBoolean(data)) {
            return data as any;
        }

        if (!data) {
            return null;
        }

        if (isDate(data)) {
            return data as R;
        }

        if (isArray(data)) {
            return data.map((currentArrayItem) => {
                if (isObject(currentArrayItem) || isObjectLike(currentArrayItem)) {
                    return this.transformCaseStyle(currentArrayItem, targetCaseStyleType);
                } else if (isArray(currentArrayItem)) {
                    return this.transformCaseStyle(currentArrayItem, targetCaseStyleType);
                } else {
                    return currentArrayItem;
                }
            }) as R;
        }

        if (isObject(data) || isObjectLike(data)) {
            return Object.keys(data).reduce((result, legacyKeyName) => {
                let currentKeyName: string;

                switch (targetCaseStyleType) {
                    case 'camel': {
                        currentKeyName = camelCase(legacyKeyName);
                        break;
                    }
                    case 'kebab': {
                        currentKeyName = kebabCase(legacyKeyName);
                        break;
                    }
                    case 'snake': {
                        currentKeyName = snakeCase(legacyKeyName);
                        break;
                    }
                    default:
                        currentKeyName = legacyKeyName;
                        break;
                }

                result[currentKeyName] = this.transformCaseStyle(data[legacyKeyName], targetCaseStyleType);

                return result;
            }, {} as R);
        }

        if (isPlainObject(data) || isString(data)) {
            return cloneDeep<R>(data as R);
        }

        return data;
    };

    public transformDAOToDTO<DAOType, DTOType>(daoData: Partial<DAOType>): DTOType {
        return this.transformCaseStyle<DAOType, DTOType>(daoData, 'camel');
    }

    public transformDTOToDAO<DTOType, DAOType>(dtoData: Partial<DTOType>): DAOType {
        return this.transformCaseStyle<DTOType, DAOType>(dtoData, 'snake');
    }

    public transformURLSearchParamsToObject(params: URLSearchParams): Record<string, any> {
        const result = {};
        for (const [key, value] of params.entries()) {
            result[key] = value;
        }
        return result;
    }
}
