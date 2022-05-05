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
import ListItem from '@mui/material/ListItem';
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
import '@modules/clients/clients-dropdown.component.less';
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

const ClientsDropdown: FC<InjectedComponentProps<ClientsDropdownProps>> = ({
    declarations,
    open = false,
    onOpen = _.noop,
    onClose = _.noop,
    onClientChange = _.noop,
}) => {
    const typographyProps: TypographyProps = {
        noWrap: true,
        style: {
            width: 180,
        },
    };

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

    const handleSelectClient = (clientId: string) => {
        navigate(`/client/${clientId}/workstation`);
        onClientChange(clientId);
        onClose();
    };

    useEffect(() => {
        if (open && buttonRef.current) {
            setAnchorEl(buttonRef.current);
        } else {
            setAnchorEl(null);
        }
    }, [open, buttonRef]);

    useEffect(() => {
        if (_.isArray(queryClientsResponseData?.list)) {
            setClients(queryClientsResponseData.list);
        }
    }, [queryClientsResponseData]);

    return (
        <Box>
            <Button
                classes={{ root: 'link' }}
                variant="text"
                endIcon={<Icon className="dropdown-icon icon-keyboard-arrow-down" />}
                startIcon={
                    getClientInformationResponseData?.response?.name
                        ? <Icon className="icon-server" />
                        : null
                }
                ref={buttonRef}
                onClick={onOpen}
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
                classes={{ root: 'clients-popover' }}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={onClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box className="header-wrapper">
                    <TextField
                        classes={{
                            root: 'search-text-field',
                        }}
                        placeholder={getComponentLocaleText('searchPlaceholder')}
                        disabled={queryClientsLoading || queryClientsLoadingMore}
                        value={searchValue}
                        onChange={(event) => setSearchValue(event.target.value)}
                    />
                    <Button
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
                                    variant="contained"
                                    size="small"
                                    startIcon={<Icon className="icon-plus" />}
                                    onClick={() => navigate('/clients/create')}
                                >
                                    {getComponentLocaleText('create')}
                                </Button>
                            </Exception>
                            : <SimpleBar autoHide={true} style={{ height: 360, width: '100%' }}>
                                {
                                    clients.map((item) => {
                                        return (
                                            <ListItem
                                                key={item.id}
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
                                            </ListItem>
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
            </Popover>
        </Box>
    );
};

export default ClientsDropdown;
