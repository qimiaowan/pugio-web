import {
    FC,
    useEffect,
    useRef,
    useState,
} from 'react';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import Button from '@mui/material/Button';
import { InjectedComponentProps } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import { ClientsDropdownProps } from './clients-dropdown.interface';
import _ from 'lodash';

const ClientsDropdown: FC<InjectedComponentProps<ClientsDropdownProps>> = ({
    declarations,
    open = false,
    onOpen = _.noop,
    onClose = _.noop,
}) => {
    const localeService = declarations.get<LocaleService>(LocaleService);

    const buttonRef = useRef<HTMLButtonElement>(null);
    const getLocaleText = localeService.useLocaleContext();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>(null);

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
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={onClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
            </Popover>
        </Box>
    );
};

export default ClientsDropdown;
