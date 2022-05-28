import { FC } from 'react';
import Box from '@mui/material/Box';
import clsx from 'clsx';
import { ExceptionProps } from '@modules/brand/exception.interface';
import Typography from '@mui/material/Typography';
import styled from '@mui/material/styles/styled';

const ExceptionWrapper = styled(Box)(({ theme }) => {
    return `
        width: 100%;
        height: 240px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        align-self: center;

        &, * {
            user-select: none;
        }

        img {
            height: 81px;
            pointer-events: none;
        }

        .title {
            font-size: 15px;
            margin-top: 15px;
            color: ${theme.palette.text.primary};
            padding: 0 ${theme.spacing(3)};
        }

        .subtitle {
            font-size: 13px;
            margin: 10px 0;
            color: ${theme.palette.text.secondary};
            padding: 0 ${theme.spacing(3)};
        }
    `;
});

const Exception: FC<ExceptionProps> = ({
    imageSrc = '',
    title = '',
    subTitle = '',
    ...props
}) => {
    return (
        <ExceptionWrapper
            {...props}
            className={clsx(props.className || '')}
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
        </ExceptionWrapper>
    );
};

export default Exception;
