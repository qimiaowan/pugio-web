import {
    FC,
} from 'react';
import { ClientMenuItemProps } from './client-menu-item.interface';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import './client-menu-item.component.less';

const ClientMenuItem: FC<ClientMenuItemProps> = ({
    title,
    icon,
    active,
    fullWidth,
}) => {
    return (
        <Box
            className={clsx('client-menu-item', {
                active,
                'full-width': fullWidth,
            })}
        >
            <Box className="icon">{icon}</Box>
            <Typography classes={{ root: 'title' }}>{title}</Typography>
        </Box>
    );
};

export default ClientMenuItem;
