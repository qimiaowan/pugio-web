import {
    FC,
} from 'react';
import { ClientMenuItemProps } from './client-menu-item.interface';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const ClientMenu: FC<ClientMenuItemProps> = ({
    active = false,
    fullWidth = false,
}) => {
    return (
        <Box>
            <Typography></Typography>
        </Box>
    );
};

export default ClientMenu;
