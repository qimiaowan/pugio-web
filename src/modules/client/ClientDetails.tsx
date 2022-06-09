/* eslint-disable no-unused-vars */
import { FC } from 'react';
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

const ClientDetailsPage = styled(Box)(() => {
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

    const { client_id: clientId } = useParams();
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

    return (
        <ClientDetailsPage>
            {
                (userClientRelationLoading || clientInformationLoading)
                    ? <Box className="loading-wrapper"><Loading /></Box>
                    : <SimpleBar style={{ width: '100%', height: '100%' }}>
                        <Box className="form-wrapper">
                        </Box>
                    </SimpleBar>
            }
        </ClientDetailsPage>
    );
};

export default ClientDetails;
