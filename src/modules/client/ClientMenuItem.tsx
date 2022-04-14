import {
    FC,
} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { ClientMenuItemProps } from '@modules/client/client-menu-item.interface';
import '@modules/client/client-menu-item.component.less';

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
            <Typography classes={{ root: 'title' }} noWrap={true}>{title}</Typography>
        </Box>
    );
};

export default ClientMenuItem;
