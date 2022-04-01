import {
    FC,
    MouseEvent,
    useState,
} from 'react';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { InjectedComponentProps } from 'khamsa';
import { LocaleService } from '../locale/locale.service';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './clients-dropdown.component.less';

const ClientsDropdown: FC<InjectedComponentProps> = ({ declarations }) => {
    const localeService = declarations.get<LocaleService>(LocaleService);

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const getLocaleText = localeService.useLocaleContext();

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box>
            <Button
                classes={{ root: 'clients-dropdown' }}
                variant="text"
                endIcon={<KeyboardArrowDownIcon />}
                onClick={handleClick}
            >{getLocaleText('app.navbar.clients')}</Button>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
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
