import {
    FC,
    MouseEvent,
    useState,
} from 'react';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import Button from '@mui/material/Button';
import { InjectedComponentProps } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';

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
                classes={{ root: 'link' }}
                variant="text"
                endIcon={<Icon className="icon-keyboard-arrow-down" style={{ fontSize: 13 }} />}
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
