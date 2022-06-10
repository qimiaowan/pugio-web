/* eslint-disable no-unused-vars */
import {
    FC,
    ReactNode,
    useCallback,
    useEffect,
    useState,
} from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import styled from '@mui/material/styles/styled';
import SimpleBar from 'simplebar-react';
import { useParams } from 'react-router-dom';
import { useRequest } from 'ahooks';
import { getContainer } from 'khamsa';
import { ClientService } from '@modules/client/client.service';
import { LoadingComponent } from '@modules/brand/loading.component';
import { FormItemProps } from '@modules/common/form-item.interface';
import { FormItemComponent } from '@modules/common/form-item.component';
import { Client } from '@modules/clients/clients.interface';
import { LocaleService } from '@modules/locale/locale.service';
import _ from 'lodash';
import clsx from 'clsx';

interface IFormItem {
    key: string;
    monospace?: boolean;
    type?: 'text-area' | 'text-field';
    extra?: ReactNode;
}

const ClientDetailsPage = styled(Box)(({ theme }) => {
    return `
        width: 100%;
        height: 100%;

        .loading-wrapper {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .wrapper {
            width: 720px;
            display: flex;
            flex-direction: column;
            margin: 0 auto;
            padding: ${theme.spacing(2)} 0;

            &.form-wrapper {
                &, * {
                    box-sizing: border-box;
                }

                .form-item {
                    margin-bottom: ${theme.spacing(2)};

                    .value-monospace {
                        font-family: Menlo, Courier, Courier New, Consolas;
                    }
                }
            }

            .part-title {
                font-weight: 700;
                user-select: none;
                margin: ${theme.spacing(2)} 0;
            }
        }
    `;
});

const ClientDetails: FC = () => {
    const container = getContainer(ClientDetails);
    const clientService = container.get<ClientService>(ClientService);
    const Loading = container.get<FC<BoxProps>>(LoadingComponent);
    const FormItem = container.get<FC<FormItemProps>>(FormItemComponent);
    const localeService = container.get<LocaleService>(LocaleService);
    const basicInfoFormItems: IFormItem[] = [
        {
            key: 'name',
        },
        {
            key: 'description',
            type: 'text-area',
        },
        {
            key: 'deviceId',
        },
    ];
    const keyPairFormItems: IFormItem[] = [
        {
            key: 'publicKey',
            type: 'text-area',
            monospace: true,
        },
        {
            key: 'privateKey',
            type: 'text-area',
            monospace: true,
        },
    ];

    const { client_id: clientId } = useParams();
    const getLocaleText = localeService.useLocaleContext('pages.clientDetails');
    const getAppLocaleText = localeService.useLocaleContext('app');
    const {
        data: userClientRelationResponseData,
        loading: userClientRelationLoading,
    } = useRequest(
        () => {
            return clientService.getUserClientRelation({ clientId });
        },
        {
            refreshDeps: [],
        },
    );
    const {
        data: clientInformationResponseData,
        loading: clientInformationLoading,
    } = useRequest(
        () => {
            return clientService.getClientInformation({ clientId });
        },
        {
            refreshDeps: [],
        },
    );
    const [clientInfo, setClientInfo] = useState<Client>(null);

    const handleUpdateClientInfo = useCallback((key, value) => {
        if (clientInfo) {
            setClientInfo({
                ...clientInfo,
                [key]: value,
            });
        }
    }, [clientInfo]);

    useEffect(() => {
        setClientInfo(clientInformationResponseData?.response);
    }, [clientInformationResponseData]);

    return (
        <ClientDetailsPage>
            {
                (userClientRelationLoading || clientInformationLoading)
                    ? <Box className="loading-wrapper"><Loading /></Box>
                    : (clientInfo && userClientRelationResponseData)
                        ? <SimpleBar style={{ width: '100%', height: '100%' }}>
                            <Box className="wrapper form-wrapper">
                                <Typography
                                    variant="subtitle1"
                                    classes={{ root: 'part-title' }}
                                >{getLocaleText('basicInfo')}</Typography>
                                {
                                    clientInfo?.version && (
                                        <FormItem
                                            editable={false}
                                            title={getLocaleText('version')}
                                            value={clientInfo.version}
                                            containerProps={{ className: 'form-item' }}
                                        />
                                    )
                                }
                                <FormItem
                                    editable={false}
                                    title={getLocaleText('verified')}
                                    value={getAppLocaleText(clientInfo.verified ? 'yes' : 'no')}
                                    containerProps={{ className: 'form-item' }}
                                />
                                <FormItem
                                    editable={false}
                                    title={getLocaleText('createdAt')}
                                    value={new Date(clientInfo.createdAt).toLocaleString()}
                                    containerProps={{ className: 'form-item' }}
                                />
                                {
                                    basicInfoFormItems.map((formItem) => {
                                        const {
                                            key,
                                            type,
                                        } = formItem;

                                        if (_.isUndefined(clientInfo[key]) || _.isNull(clientInfo[key])) {
                                            return null;
                                        }

                                        return (
                                            <FormItem
                                                key={key}
                                                value={clientInfo[key]}
                                                title={getLocaleText(`form.${key}`)}
                                                editable={userClientRelationResponseData?.response?.roleType <= 1}
                                                editorType={type}
                                                containerProps={{ className: 'form-item' }}
                                                onValueChange={(value) => handleUpdateClientInfo(key, value)}
                                            />
                                        );
                                    })
                                }
                            </Box>
                            {
                                (clientInfo.publicKey && clientInfo.privateKey) && (
                                    <>
                                        <Box className="wrapper"><Divider /></Box>
                                        <Box className="wrapper form-wrapper">
                                            <Typography
                                                variant="subtitle1"
                                                classes={{ root: 'part-title' }}
                                            >{getLocaleText('keyPair')}</Typography>
                                            {
                                                keyPairFormItems.map((formItem) => {
                                                    const {
                                                        key,
                                                        type,
                                                        monospace = false,
                                                    } = formItem;

                                                    return (
                                                        <FormItem
                                                            key={key}
                                                            value={clientInfo[key]}
                                                            title={getLocaleText(`form.${key}`)}
                                                            editable={userClientRelationResponseData?.response?.roleType <= 1}
                                                            editorType={type}
                                                            valueProps={{
                                                                classes: {
                                                                    root: clsx({
                                                                        'value-monospace': monospace,
                                                                    }),
                                                                },
                                                            }}
                                                            containerProps={{ className: 'form-item' }}
                                                            onValueChange={(value) => handleUpdateClientInfo(key, value)}
                                                        />
                                                    );
                                                })
                                            }
                                        </Box>
                                    </>
                                )
                            }
                            {
                                userClientRelationResponseData?.response?.roleType <= 1 && (
                                    <>
                                        <Box className="wrapper"><Divider /></Box>
                                        <Box className="wrapper danger-zone">
                                            <Typography
                                                variant="subtitle1"
                                                classes={{ root: 'part-title' }}
                                            >{getLocaleText('dangerZone')}</Typography>
                                            <Box className="button-group">
                                            </Box>
                                        </Box>
                                    </>
                                )
                            }
                        </SimpleBar>
                        : null
            }
        </ClientDetailsPage>
    );
};

export default ClientDetails;
