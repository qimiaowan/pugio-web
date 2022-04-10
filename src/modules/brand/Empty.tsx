import { FC } from 'react';
import Box from '@mui/material/Box';
import emptyImage from '@modules/brand/empty.svg';
import clsx from 'clsx';
import '@modules/brand/empty.component.less';
import { EmptyProps } from '@modules/brand/empty.interface';
import Typography from '@mui/material/Typography';

const Empty: FC<EmptyProps> = ({
    title = '',
    subTitle = '',
    ...props
}) => {
    return (
        <Box
            {...props}
            className={clsx('empty', props.className || '')}
        >
            <Box component="img" src={emptyImage} />
            {
                title && (
                    <Typography classes={{ root: 'title' }} variant="subtitle2">{title}</Typography>
                )
            }
            {
                subTitle && (
                    <Typography classes={{ root: 'subtitle' }} variant="body2">{subTitle}</Typography>
                )
            }
            {props.children}
        </Box>
    );
};

export default Empty;
