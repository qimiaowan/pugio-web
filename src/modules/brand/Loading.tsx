import { FC } from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import clsx from 'clsx';
import styled from '@mui/material/styles/styled';
import useTheme from '@mui/material/styles/useTheme';

const StyledBox = styled(Box)(() => {
    return '';
});

const Loading: FC<BoxProps> = ({
    className = '',
    style,
    ...props
}) => {
    const theme = useTheme();

    return (
        <StyledBox
            sx={{
                width: '32px',
            }}
            className={clsx('loading', className)}
            {...props}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                style={style}
                fill={theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[400]}
            >
                <circle transform="translate(8 0)" cx="0" cy="16" r="0">
                    <animate attributeName="r" values="0; 4; 0; 0" dur="1.2s" repeatCount="indefinite" begin="0" keyTimes="0;0.2;0.7;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8" calcMode="spline"/>
                </circle>
                <circle transform="translate(16 0)" cx="0" cy="16" r="0">
                    <animate attributeName="r" values="0; 4; 0; 0" dur="1.2s" repeatCount="indefinite" begin="0.3" keyTimes="0;0.2;0.7;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8" calcMode="spline"/>
                </circle>
                <circle transform="translate(24 0)" cx="0" cy="16" r="0">
                    <animate attributeName="r" values="0; 4; 0; 0" dur="1.2s" repeatCount="indefinite" begin="0.6" keyTimes="0;0.2;0.7;1" keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8" calcMode="spline"/>
                </circle>
            </svg>
        </StyledBox>
    );
};

export default Loading;
