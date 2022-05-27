import {
    FC,
    useEffect,
    useRef,
    useState,
} from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Icon from '@mui/material/Icon';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import TextField from '@mui/material/TextField';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { InjectedComponentProps } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import { ClientsDropdownProps } from '@modules/clients/clients-dropdown.interface';
import _ from 'lodash';
import {
    useDebounce,
    useRequest,
} from 'ahooks';
import { ClientsService } from '@modules/clients/clients.service';
import { QueryClientsResponseDataItem } from '@modules/clients/clients.interface';
import SimpleBar from 'simplebar-react';
import {
    useNavigate,
    useParams,
} from 'react-router-dom';
import { LoadingComponent } from '@modules/brand/loading.component';
import { ExceptionProps } from '@modules/brand/exception.interface';
import { ExceptionComponent } from '@modules/brand/exception.component';
import { UtilsService } from '@modules/utils/utils.service';
import { ClientService } from '@modules/client/client.service';
import clsx from 'clsx';
import styled from '@mui/material/styles/styled';
import Paper from '@mui/material/Paper';
import { StoreService } from '@modules/store/store.service';
import shallow from 'zustand/shallow';

const ClientsDropdownWrapper = styled(Box)(({ theme }) => {
    return `
        .link {
            .icon-server {
                font-weight: 700;
            }

            .text {
                &.selected {
                    font-weight: 700;
                    max-width: 200px;
                }
            }

            &.active {
                color: ${theme.palette.mode === 'dark' ? 'white' : 'black'} !important;
            }
        }
    `;
});

const PopoverContent = styled(Paper)(({ theme }) => {
    const mode = theme.palette.mode;

    return `
        display: flex;
        flex-direction: column;
        align-items: stretch;
        background-color: ${mode === 'dark' ? theme.palette.grey[900] : 'white'};

        .header-wrapper {
            padding: 0 ${theme.spacing(1)};
            display: flex;
            align-items: center;
            border-bottom: 1px solid ${theme.palette.divider};

            .create-button {
                margin-left: 5px;
            }

            .search-text-field {
                flex-grow: 1;
                flex-shrink: 1;
            }
        }

        .load-more-wrapper {
            box-sizing: border-box;
            padding: 5px;
        }

        .loading-wrapper {
            width: 100%;
            height: 200px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .footer-wrapper {
            min-width: 360px;
            padding: 5px 10px;

            .view-all-button {
                font-size: 12px;
                padding: 3px;
                line-height: 14px;

                .icon {
                    font-size: 12px;
                    line-height: 14px;
                }
            }
        }
    `;
});

const ClientsDropdown: FC<InjectedComponentProps<ClientsDropdownProps>> = ({
    declarations,
    onClientChange = _.noop,
}) => {
    const typographyProps: TypographyProps = {
        noWrap: true,
        style: {
            width: 180,
        },
    };

    const storeService = declarations.get<StoreService>(StoreService);
    const localeService = declarations.get<LocaleService>(LocaleService);
    const clientsService = declarations.get<ClientsService>(ClientsService);
    const utilsService = declarations.get<UtilsService>(UtilsService);
    const clientService = declarations.get<ClientService>(ClientService);
    const Loading = declarations.get<FC<BoxProps>>(LoadingComponent);
    const Exception = declarations.get<FC<ExceptionProps>>(ExceptionComponent);

    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedSearchValue = useDebounce(searchValue, { wait: 500 });
    const { client_id: selectedClientId } = useParams();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const getLocaleText = localeService.useLocaleContext();
    const getComponentLocaleText = localeService.useLocaleContext('components.clientsDropdown');
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>(null);
    const [clients, setClients] = useState<QueryClientsResponseDataItem[]>([]);
    const {
        data: queryClientsResponseData,
        loadMore: queryMoreClients,
        loading: queryClientsLoading,
        loadingMore: queryClientsLoadingMore,
    } = utilsService.useLoadMore<QueryClientsResponseDataItem>(
        (data) => clientsService.queryClients(
            {
                ..._.pick(data, ['lastCursor', 'size']),
                search: debouncedSearchValue,
            },
        ),
        {
            reloadDeps: [debouncedSearchValue],
        },
    );
    const {
        data: getClientInformationResponseData,
    } = useRequest(
        () => {
            return clientService.getClientInformation({
                clientId: selectedClientId,
            });
        },
        {
            refreshDeps: [selectedClientId],
        },
    );
    const {
        clientsDropdownOpen,
        switchClientsDropdownVisibility,
    } = storeService.useStore(
        (state) => {
            const {
                clientsDropdownOpen,
                switchClientsDropdownVisibility,
            } = state;
            return {
                clientsDropdownOpen,
                switchClientsDropdownVisibility,
            };
        },
        shallow,
    );

    const handleSelectClient = (clientId: string) => {
        navigate(`/client/${clientId}/workstation`);
        onClientChange(clientId);
        switchClientsDropdownVisibility(false);
    };

    useEffect(() => {
        if (buttonRef.current) {
            setAnchorEl(buttonRef.current);
        } else {
            setAnchorEl(null);
        }
    }, [buttonRef]);

    useEffect(() => {
        if (_.isArray(queryClientsResponseData?.list)) {
            setClients(queryClientsResponseData.list);
        }
    }, [queryClientsResponseData]);

    useEffect(() => {
        if (_.isFunction(searchRef?.current?.focus)) {
            searchRef.current.focus();
        }
    }, [clients, searchRef.current]);

    return (
        <ClientsDropdownWrapper>
            <Button
                classes={{
                    root: clsx('link', {
                        active: Boolean(anchorEl) && clientsDropdownOpen,
                    }),
                }}
                variant="text"
                endIcon={<Icon className="dropdown-icon icon-keyboard-arrow-down" />}
                startIcon={
                    getClientInformationResponseData?.response?.name
                        ? <Icon className="icon-server" />
                        : null
                }
                ref={buttonRef}
                onClick={() => switchClientsDropdownVisibility(true)}
            >
                <Typography
                    noWrap={true}
                    classes={{
                        root: clsx('text', {
                            selected: Boolean(getClientInformationResponseData?.response?.name),
                        }),
                    }}
                >
                    {
                        getClientInformationResponseData?.response?.name
                            ? getClientInformationResponseData.response.name
                            : getLocaleText('app.navbar.clients')
                    }
                </Typography>
            </Button>
            <Popover
                open={Boolean(anchorEl) && clientsDropdownOpen}
                anchorEl={anchorEl}
                onClose={() => switchClientsDropdownVisibility(false)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                disablePortal={true}
            >
                <PopoverContent>
                    <Box className="header-wrapper">
                        <TextField
                            inputRef={searchRef}
                            classes={{
                                root: 'search-text-field',
                            }}
                            autoFocus={true}
                            placeholder={getComponentLocaleText('searchPlaceholder')}
                            disabled={queryClientsLoading || queryClientsLoadingMore}
                            value={searchValue}
                            InputProps={{
                                sx: {
                                    border: 0,
                                },
                                startAdornment: <Icon className="icon-search" />,
                            }}
                            onChange={(event) => setSearchValue(event.target.value)}
                        />
                        <Button
                            size="small"
                            startIcon={<Icon className="icon-plus" />}
                            classes={{ root: 'create-button' }}
                            onClick={() => navigate('/clients/create')}
                        >{getComponentLocaleText('create')}</Button>
                    </Box>
                    {
                        queryClientsLoading
                            ? <Box className="loading-wrapper">
                                <Loading />
                            </Box>
                            : clients.length === 0
                                ? <Exception
                                    imageSrc="/static/images/empty.svg"
                                    title={getComponentLocaleText('empty.title')}
                                    subTitle={getComponentLocaleText('empty.subTitle')}
                                >
                                    <Button
                                        size="small"
                                        variant="text"
                                        color="primary"
                                        startIcon={<Icon className="icon-plus" />}
                                        onClick={() => navigate('/clients/create')}
                                    >{getComponentLocaleText('create')}</Button>
                                </Exception>
                                : <SimpleBar autoHide={true} style={{ height: 360, width: '100%' }}>
                                    {
                                        clients.map((item) => {
                                            return (
                                                <ListItemButton
                                                    key={item.id}
                                                    selected={selectedClientId === item.client.id}
                                                    onClick={() => handleSelectClient(item.client.id)}
                                                >
                                                    <ListItemIcon>
                                                        {
                                                            selectedClientId === item.client.id && (
                                                                <Icon className="icon-check" />
                                                            )
                                                        }
                                                    </ListItemIcon>
                                                    <ListItemIcon><Icon className="icon-server" /></ListItemIcon>
                                                    <ListItemText
                                                        disableTypography={false}
                                                        primaryTypographyProps={typographyProps}
                                                        secondaryTypographyProps={typographyProps}
                                                    >{item.client.name || item.client.id}</ListItemText>
                                                </ListItemButton>
                                            );
                                        })
                                    }
                                    {
                                        !queryClientsLoading && (
                                            <Box className="load-more-wrapper">
                                                <Button
                                                    variant="text"
                                                    classes={{ root: 'load-more-button' }}
                                                    disabled={queryClientsLoadingMore || queryClientsResponseData?.remains === 0}
                                                    fullWidth={true}
                                                    onClick={queryMoreClients}
                                                >
                                                    {
                                                        getComponentLocaleText(
                                                            queryClientsLoadingMore
                                                                ? 'loading'
                                                                : queryClientsResponseData?.remains === 0
                                                                    ? 'noMore'
                                                                    : 'loadMore',
                                                        )
                                                    }
                                                </Button>
                                            </Box>
                                        )
                                    }
                                </SimpleBar>
                    }
                    <Divider />
                    <Box className="footer-wrapper">
                        <Button
                            classes={{ root: 'link-button view-all-button' }}
                            endIcon={<Icon className="icon icon-arrow-right" fontSize="small" />}
                            onClick={() => navigate('/clients/list')}
                        >{getComponentLocaleText('viewAll')}</Button>
                    </Box>
                </PopoverContent>
            </Popover>
        </ClientsDropdownWrapper>
    );
};

export default ClientsDropdown;
