/* eslint-disable no-unused-vars */
import {
    FC,
    ReactNode,
    useCallback,
    useEffect,
    useState,
} from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import Divider from '@mui/material/Divider';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import styled from '@mui/material/styles/styled';
import SimpleBar from 'simplebar-react';
import { useParams } from 'react-router-dom';
import { useRequest } from 'ahooks';
import { getContainer } from 'khamsa';
import { ClientService } from '@modules/client/client.service';
import { LoadingComponent } from '@modules/brand/loading.component';
import {
    FormItemEditor,
    FormItemProps,
    FormItemValueRender,
} from '@modules/common/form-item.interface';
import { FormItemComponent } from '@modules/common/form-item.component';
import { Client } from '@modules/clients/clients.interface';
import { LocaleService } from '@modules/locale/locale.service';
import _ from 'lodash';
import clsx from 'clsx';
import { UserSearcherProps } from '@modules/user/user-searcher.interface';
import { UserSearcherComponent } from '@modules/user/user-searcher.component';
import { ModalComponent } from '@modules/common/modal.component';
import { ModalProps } from '@modules/common/modal.interface';

interface IFormItem {
    key: string;
    Editor?: FormItemEditor;
    helper?: ReactNode;
    valueRender?: FormItemValueRender;
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
                    margin-bottom: ${theme.spacing(5)};

                    .form-item-editor-textarea {
                        resize: none;
                        outline: 0;
                        border: 0;
                        flex-grow: 1;
                        flex-shrink: 1;
                        padding: ${theme.spacing(1)};
                        border: 1px solid ${theme.palette.text.secondary};
                        border-radius: ${theme.shape.borderRadius}px;

                        &:hover {
                            border-color: ${theme.palette.text.primary};
                        }

                        &:focus {
                            border-color: ${theme.palette.primary.main};
                        }
                    }
                }
            }

            .part-title {
                font-weight: 700;
                user-select: none;
                margin: ${theme.spacing(2)} 0;
                display: flex;
                align-items: center;
                font-size: 16px;
            }

            &.danger-zone {
                padding-left: ${theme.spacing(3)};
                padding-right: ${theme.spacing(3)};
                border-radius: ${theme.shape.borderRadius}px;
                box-sizing: border-box;
                border: 1px solid ${theme.palette.error.main};
                margin-bottom: ${theme.spacing(5)};

                .form-item:last-of-type {
                    margin-bottom: ${theme.spacing(3)};
                }
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
    const UserSearcher = container.get<FC<UserSearcherProps>>(UserSearcherComponent);
    const Modal = container.get<FC<ModalProps>>(ModalComponent);

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
        refresh: reloadClientInformation,
    } = useRequest(
        () => {
            return clientService.getClientInformation({ clientId });
        },
        {
            refreshDeps: [],
        },
    );
    const [clientInfo, setClientInfo] = useState<Client>(null);
    const [deleteClientConfirmContent, setDeleteClientConfirmContent] = useState<string>('');
    const [transferOwnershipConfirmContent, setTransferOwnershipConfirmContent] = useState<string>('');

    const basicInfoFormItems: IFormItem[] = [
        {
            key: 'name',
        },
        {
            key: 'description',
        },
        {
            key: 'deviceId',
            helper: getLocaleText('helpers.deviceId'),
        },
    ];
    const keyPairFormItems: IFormItem[] = [
        {
            key: 'publicKey',
            helper: getLocaleText('helpers.publicKey'),
            Editor: ({
                value,
                updateValue,
            }) => {
                return (
                    <textarea
                        className="form-item-editor-textarea monospace"
                        style={{ height: 320 }}
                        value={value}
                        onChange={(event) => updateValue(event.target.value)}
                    />
                );
            },
            valueRender: ({
                value,
                changeMode,
            }) => (
                value
                    ? <Typography noWrap={false} classes={{ root: 'monospace' }}>{value}</Typography>
                    : <Button
                        startIcon={<Icon className="icon-plus" />}
                        onClick={() => changeMode('edit')}
                    >{getLocaleText('initializePublicKey')}</Button>
            ),
        },
        {
            key: 'privateKey',
            helper: getLocaleText('helpers.privateKey'),
            Editor: ({
                value,
                updateValue,
            }) => {
                return (
                    <textarea
                        className="form-item-editor-textarea monospace"
                        style={{ height: 320 }}
                        value={value}
                        onChange={(event) => updateValue(event.target.value)}
                    />
                );
            },
            valueRender: ({
                value,
                changeMode,
            }) => (
                value
                    ? <Typography noWrap={false} classes={{ root: 'monospace' }}>{value}</Typography>
                    : <Button
                        startIcon={<Icon className="icon-plus" />}
                        onClick={() => changeMode('edit')}
                    >{getLocaleText('initializePrivateKey')}</Button>
            ),
        },
    ];

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

    useEffect(() => {
        clientService.updateClientInformation({
            clientId,
            updates: clientInfo,
        });
    }, [clientInfo]);

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
                                >
                                    {getLocaleText('basicInfo')}
                                    <Button
                                        variant="text"
                                        size="small"
                                        startIcon={<Icon className="icon-refresh-cw" />}
                                        sx={{ marginLeft: 1 }}
                                        onClick={reloadClientInformation}
                                    >{getAppLocaleText('refresh')}</Button>
                                </Typography>
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
                                            Editor,
                                            helper,
                                            valueRender,
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
                                                Editor={Editor}
                                                valueRender={valueRender}
                                                containerProps={{ className: 'form-item' }}
                                                helper={helper}
                                                onValueChange={(value) => handleUpdateClientInfo(key, value)}
                                            />
                                        );
                                    })
                                }
                            </Box>
                            {
                                userClientRelationResponseData?.response?.roleType <= 1 && (
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
                                                        Editor,
                                                        helper,
                                                        valueRender,
                                                    } = formItem;

                                                    return (
                                                        <FormItem
                                                            key={key}
                                                            value={clientInfo[key] || ''}
                                                            title={getLocaleText(`form.${key}`)}
                                                            editable={userClientRelationResponseData?.response?.roleType <= 1 && !!clientInfo[key]}
                                                            valueProps={{
                                                                classes: {
                                                                    root: clsx('monospace'),
                                                                },
                                                            }}
                                                            Editor={Editor}
                                                            valueRender={valueRender}
                                                            containerProps={{ className: 'form-item' }}
                                                            helper={helper}
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
                                        <Box className="wrapper form-wrapper danger-zone">
                                            <Typography
                                                variant="subtitle1"
                                                color="error"
                                                classes={{ root: 'part-title' }}
                                            >{getLocaleText('dangerZone')}</Typography>
                                            <FormItem
                                                value={null}
                                                title={getLocaleText('danger.transferOwnership.title')}
                                                editable={false}
                                                containerProps={{ className: 'form-item' }}
                                                helper={getLocaleText('helpers.transferOwnership')}
                                                valueRender={() => {
                                                    return (
                                                        <UserSearcher
                                                            Trigger={({ openPopover }) => {
                                                                return (
                                                                    <Button
                                                                        color="warning"
                                                                        startIcon={<Icon className="icon-send" />}
                                                                        onClick={openPopover}
                                                                    >{getLocaleText('danger.transferOwnership.title')}</Button>
                                                                );
                                                            }}
                                                            mode="single"
                                                        />
                                                    );
                                                }}
                                            />
                                            <FormItem
                                                value={null}
                                                editable={false}
                                                title={getLocaleText('danger.delete.title')}
                                                containerProps={{ className: 'form-item' }}
                                                helper={getLocaleText('helpers.delete')}
                                                valueRender={() => {
                                                    return (
                                                        <Modal
                                                            Trigger={({ openModal }) => {
                                                                return (
                                                                    <Button
                                                                        color="error"
                                                                        startIcon={<Icon className="icon-trash-2" />}
                                                                        onClick={openModal}
                                                                    >{getLocaleText('danger.delete.title')}</Button>
                                                                );
                                                            }}
                                                        >
                                                            {
                                                                ({ closeModal }) => {
                                                                    return (
                                                                        <>
                                                                            <DialogTitle
                                                                                sx={{
                                                                                    backgroundColor: 'error.main',
                                                                                    color: 'white',
                                                                                }}
                                                                            >{getLocaleText('deleteClient.title')}</DialogTitle>
                                                                            <DialogContent>
                                                                                <Alert
                                                                                    severity="warning"
                                                                                    sx={{ marginBottom: 2 }}
                                                                                >{getLocaleText('deleteClient.description', { clientName: clientInfo?.name })}</Alert>
                                                                                <Typography
                                                                                    sx={{
                                                                                        marginTop: 2,
                                                                                        marginBottom: 1,
                                                                                    }}
                                                                                >{getLocaleText('deleteClient.confirmText', { clientName: clientInfo?.name })}</Typography>
                                                                                <TextField
                                                                                    fullWidth={true}
                                                                                    value={deleteClientConfirmContent}
                                                                                    onChange={(event) => setDeleteClientConfirmContent(event.target.value)}
                                                                                />
                                                                            </DialogContent>
                                                                        </>
                                                                    );
                                                                }
                                                            }
                                                        </Modal>
                                                    );
                                                }}
                                            />
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
