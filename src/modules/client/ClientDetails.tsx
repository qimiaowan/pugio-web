/* eslint-disable no-unused-vars */
import {
    FC,
    ReactNode,
    useEffect,
    useState,
} from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import styled from '@mui/material/styles/styled';
import SimpleBar from 'simplebar-react';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
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
import useTheme from '@mui/material/styles/useTheme';

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

        .form-wrapper {
            width: 720px;
            display: flex;
            flex-direction: column;
            margin: 0 auto;
            padding: ${theme.spacing(2)} 0;

            &, * {
                box-sizing: border-box;
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
    const formItems: Array<{
        key: string;
        type?: 'text-area' | 'text-field';
        extra?: ReactNode;
    }> = [
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
        {
            key: 'publicKey',
            type: 'text-area',
        },
        {
            key: 'privateKey',
            type: 'text-area',
        },
    ];

    const { client_id: clientId } = useParams();
    const theme = useTheme();
    const getLocaleText = localeService.useLocaleContext('pages.clientDetails');
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
                            <Box className="form-wrapper">
                                {
                                    formItems.map((formItem) => {
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
                                                containerProps={{
                                                    style: {
                                                        marginBottom: theme.spacing(2),
                                                    },
                                                }}
                                            />
                                        );
                                    })
                                }
                            </Box>
                        </SimpleBar>
                        : <></>
            }
        </ClientDetailsPage>
    );
};

export default ClientDetails;
