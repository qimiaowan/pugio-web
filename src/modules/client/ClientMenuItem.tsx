import {
    FC,
} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { ClientMenuItemProps } from '@modules/client/client-menu-item.interface';
import styled from '@mui/material/styles/styled';

const ClientMenuItemWrapper = styled(Box)(({ theme }) => {
    const mode = theme.palette.mode;

    return `
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        text-decoration: none;
        color: ${theme.palette.text.primary};
        padding: ${theme.spacing(2)};
        min-width: 80px;

        .title {
            font-size: 10px;
            text-decoration: none;
        }

        .icon {
            display: flex;
            align-items: center;

            .pugio-icons {
                font-size: 18px;
            }
        }

        &.full-width {
            flex-direction: row;
            min-width: 120px;

            .icon {
                margin-right: 5px;
            }
        }

        &.active {
            &, &:hover {
                background-color: ${mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300]};
            }
        }

        &:hover {
            background-color: ${mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200]};
        }

        &.active, &:hover {
            color: ${mode === 'dark' ? theme.palette.grey[100] : theme.palette.grey[800]};
        }
    `;
});

const ClientMenuItem: FC<ClientMenuItemProps> = ({
    title,
    icon,
    active,
    fullWidth,
}) => {
    return (
        <ClientMenuItemWrapper
            className={clsx('client-menu-item', {
                active,
                'full-width': fullWidth,
            })}
        >
            <Box className="icon">{icon}</Box>
            <Typography classes={{ root: 'title' }} noWrap={true}>{title}</Typography>
        </ClientMenuItemWrapper>
    );
};

export default ClientMenuItem;
