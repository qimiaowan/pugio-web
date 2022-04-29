import { FC } from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import clsx from 'clsx';

const ClientMembers: FC<BoxProps> = ({
    className = '',
    ...props
}) => {
    return (
        <Box
            {...props}
            className={clsx('page', className)}
        >
            <Box className="header"></Box>
            <Box className="single-column">
            </Box>
        </Box>
    );
};

export default ClientMembers;
