/* eslint-disable no-unused-vars */
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
import { useInfiniteScroll } from 'ahooks';
import { ClientsService } from '@modules/clients/clients.service';
import { InfiniteScrollHookData } from '@modules/request/request.interface';
import { QueryClientsResponseData } from '@modules/clients/clients.interface';
import SimpleBar from 'simplebar-react';
import '@modules/clients/clients-dropdown.component.less';
import {
    useNavigate,
    useParams,
} from 'react-router-dom';
import { LoadingComponent } from '@modules/brand/loading.component';
import { EmptyProps } from '@modules/brand/empty.interface';
import { EmptyComponent } from '@modules/brand/empty.component';

const ClientsDropdown: FC<InjectedComponentProps<ClientsDropdownProps>> = ({
    declarations,
    open = false,
    onOpen = _.noop,
    onClose = _.noop,
}) => {
    const localeService = declarations.get<LocaleService>(LocaleService);
    const clientsService = declarations.get<ClientsService>(ClientsService);
    const typographyProps: TypographyProps = {
        noWrap: true,
        style: {
            minWidth: 140,
            maxWidth: 180,
        },
    };
    const Loading = declarations.get<FC<BoxProps>>(LoadingComponent);
    const Empty = declarations.get<FC<EmptyProps>>(EmptyComponent);

    const navigate = useNavigate();
    const { client_id: selectedClientId } = useParams();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const getLocaleText = localeService.useLocaleContext();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>(null);
    const [clients, setClients] = useState<QueryClientsResponseData[]>([]);
    const {
        data: queryClientsResponseData,
        loadMore: queryMoreClients,
        loading: queryClientsLoading,
        loadingMore: queryClientsLoadingMore,
    } = useInfiniteScroll(
        async (data: InfiniteScrollHookData<QueryClientsResponseData>) => {
            const response = await clientsService.queryClients(_.omit(data, ['list']));

            return {
                list: response?.response?.items || [],
                ...(_.omit(_.get(response, 'response'), ['items', 'lastCursor']) || {}),
                lastCursor: Array.from(response?.response?.items || []).pop().id,
            };
        },
        {
            isNoMore: (data) => data && data.remains === 0,
        },
    );

    const handleSelectClient = (clientId: string) => {
        navigate(`/clients/${clientId}/workstation`);
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
                ref={buttonRef}
                onClick={onOpen}
            >{getLocaleText('app.navbar.clients')}</Button>
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
                        disabled={queryClientsLoading || queryClientsLoadingMore}
                        InputProps={{
                            classes: {
                                input: 'small search-text-field--input',
                            },
                        }}
                    />
                    <Button
                        startIcon={<Icon className="icon-plus" fontSize="small" />}
                        classes={{ root: 'small create-button' }}
                    >{getLocaleText('components.clientsDropdown.create')}</Button>
                </Box>
                {
                    clients.length === 0
                        ? <Empty
                            title={getLocaleText('components.clientsDropdown.empty.title')}
                            subTitle={getLocaleText('components.clientsDropdown.empty.subTitle')}
                        >
                            <Button
                                classes={{ root: 'tiny' }}
                                variant="contained"
                                startIcon={<Icon className="icon-plus" />}
                            >
                                {getLocaleText('components.clientsDropdown.create')}
                            </Button>
                        </Empty>
                        : <SimpleBar autoHide={true} style={{ height: 360, width: 360 }}>
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
                                            <ListItemIcon><Icon className="icon-channel" /></ListItemIcon>
                                            <ListItemText
                                                disableTypography={false}
                                                primaryTypographyProps={typographyProps}
                                                secondaryTypographyProps={typographyProps}
                                            >{item.client.name}</ListItemText>
                                        </ListItem>
                                    );
                                })
                            }
                            <Box className="load-more-wrapper">
                                <Button
                                    variant="text"
                                    classes={{ root: 'load-more-button' }}
                                    disabled={queryClientsLoading || queryClientsLoadingMore || queryClientsResponseData?.remains === 0}
                                    fullWidth={true}
                                    onClick={queryMoreClients}
                                >
                                    {
                                        getLocaleText(
                                            (queryClientsLoading || queryClientsLoadingMore)
                                                ? 'components.clientsDropdown.loading'
                                                : queryClientsResponseData?.remains === 0
                                                    ? 'components.clientsDropdown.noMore'
                                                    : 'components.clientsDropdown.loadMore',
                                        )
                                    }
                                </Button>
                            </Box>
                        </SimpleBar>
                }
                {
                    queryClientsLoading && (
                        <Box className="loading-wrapper">
                            <Loading />
                        </Box>
                    )
                }
                <Divider />
                <Box className="footer-wrapper">
                    <Button
                        classes={{ root: 'link-button view-all-button' }}
                        endIcon={<Icon className="icon icon-arrow-right" fontSize="small" />}
                    >
                        {getLocaleText('components.clientsDropdown.viewAll')}
                    </Button>
                </Box>
            </Popover>
        </Box>
    );
};

export default ClientsDropdown;
