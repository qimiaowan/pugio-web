import { FC } from 'react';
import Box from '@mui/material/Box';
import clsx from 'clsx';
import '@modules/brand/exception.component.less';
import { ExceptionProps } from '@modules/brand/exception.interface';
import Typography from '@mui/material/Typography';

const Exception: FC<ExceptionProps> = ({
    imageSrc = '',
    title = '',
    subTitle = '',
    ...props
}) => {
    return (
        <Box
            {...props}
            className={clsx('exception', props.className || '')}
        >
            {
                imageSrc && (
                    <Box component="img" src={imageSrc} />
                )
            }
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

export default Exception;
