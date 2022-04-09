import {
    FC,
    useEffect,
    useRef,
    useState,
} from 'react';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Icon from '@mui/material/Icon';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { TypographyProps } from '@mui/material/Typography';
import { InjectedComponentProps } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import { ClientsDropdownProps } from '@modules/clients/clients-dropdown.interface';
import _ from 'lodash';
import { useInfiniteScroll } from 'ahooks';
import { ClientsService } from '@modules/clients/clients.service';
import { InfiniteScrollHookData } from '@modules/request/request.interface';
import { QueryClientsResponseData } from '@modules/clients/clients.interface';
import { StoreService } from '@modules/store/store.service';
import shallow from 'zustand/shallow';
import '@modules/clients/clients-dropdown.component.less';

const ClientsDropdown: FC<InjectedComponentProps<ClientsDropdownProps>> = ({
    declarations,
    open = false,
    onOpen = _.noop,
    onClose = _.noop,
}) => {
    const localeService = declarations.get<LocaleService>(LocaleService);
    const clientsService = declarations.get<ClientsService>(ClientsService);
    const storeService = declarations.get<StoreService>(StoreService);
    const typographyProps: TypographyProps = {
        noWrap: true,
        style: {
            minWidth: 140,
            maxWidth: 180,
        },
    };

    const buttonRef = useRef<HTMLButtonElement>(null);
    const getLocaleText = localeService.useLocaleContext();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>(null);
    const {
        data: queryClientsResponseData,
        // loadMore: queryMoreClients,
        // loading: queryClientsLoading,
    } = useInfiniteScroll(
        async (data: InfiniteScrollHookData<QueryClientsResponseData>) => {
            const response = await clientsService.queryClients(_.omit(data, ['list']));

            return {
                list: response?.response?.items || [],
                ...(_.omit(_.get(response, 'response'), ['items']) || {}),
            };
        },
        {
            isNoMore: (data) => data && data.remains === 0,
        },
    );
    const [selectedClientId, setSelectedClientId] = storeService.useStore(
        (state) => {
            const {
                selectedClientId,
                setSelectedClientId,
            } = state;

            return [selectedClientId, setSelectedClientId];
        },
        shallow,
    );

    const handleSelectClient = (clientId: string) => {
        setSelectedClientId(clientId);
        onClose();
    };

    useEffect(() => {
        if (open && buttonRef.current) {
            setAnchorEl(buttonRef.current);
        } else {
            setAnchorEl(null);
        }
    }, [open, buttonRef]);

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
                <List classes={{ root: 'list' }}>
                    {
                        _.isArray(_.get(queryClientsResponseData, 'list'))
                            ? (_.get(queryClientsResponseData, 'list') as QueryClientsResponseData[]).map((item) => {
                                return (
                                    <ListItem
                                        key={item.id}
                                        classes={{ root: 'list-item' }}
                                        onClick={() => handleSelectClient(item.client.id)}
                                    >
                                        <ListItemIcon><Icon className="icon-channel" /></ListItemIcon>
                                        <ListItemText
                                            disableTypography={false}
                                            primaryTypographyProps={typographyProps}
                                            secondaryTypographyProps={typographyProps}
                                        >{item.client.name}</ListItemText>
                                        <ListItemIcon style={{ justifyContent: 'flex-end' }}>
                                            {
                                                selectedClientId === item.client.id && (
                                                    <Icon className="icon-check" />
                                                )
                                            }
                                        </ListItemIcon>
                                    </ListItem>
                                );
                            })
                            : null
                    }
                </List>
            </Popover>
        </Box>
    );
};

export default ClientsDropdown;
