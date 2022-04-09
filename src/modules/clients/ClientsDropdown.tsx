/* eslint-disable no-unused-vars */
import {
    FC,
    useEffect,
    useRef,
    useState,
} from 'react';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
// import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import Button from '@mui/material/Button';
import { InjectedComponentProps } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import { ClientsDropdownProps } from '@modules/clients/clients-dropdown.interface';
import _ from 'lodash';
import { useRequest } from 'ahooks';
import { ClientsService } from '@modules/clients/clients.service';

const ClientsDropdown: FC<InjectedComponentProps<ClientsDropdownProps>> = ({
    declarations,
    open = false,
    onOpen = _.noop,
    onClose = _.noop,
}) => {
    const localeService = declarations.get<LocaleService>(LocaleService);
    const clientsService = declarations.get<ClientsService>(ClientsService);

    const buttonRef = useRef<HTMLButtonElement>(null);
    const getLocaleText = localeService.useLocaleContext();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>(null);
    const {
        run: runQueryClients,
        data: queryClientsResponseData,
        // loading: queryClientsLoading,
    } = useRequest(clientsService.queryClients.bind(clientsService) as typeof clientsService.queryClients, { manual: true });

    useEffect(() => {
        if (open && buttonRef.current) {
            setAnchorEl(buttonRef.current);
        } else {
            setAnchorEl(null);
        }
    }, [open, buttonRef]);

    useEffect(() => {
        runQueryClients({});
    }, []);

    useEffect(() => {
        console.log(queryClientsResponseData);
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
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={onClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                {
                    _.isArray(_.get(queryClientsResponseData, 'response.items'))
                        ? _.get(queryClientsResponseData, 'response.items').map((item) => {
                            return (
                                <p key={item.id}>{item.client.name}</p>
                            );
                        })
                        : null
                }
            </Popover>
        </Box>
    );
};

export default ClientsDropdown;
