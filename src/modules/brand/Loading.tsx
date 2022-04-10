import { FC } from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import '@modules/brand/loading.component.less';
import clsx from 'clsx';

const Loading: FC<BoxProps> = ({
    className = '',
    ...props
}) => {
    return (
        <Box
            className={clsx('loading', className)}
            {...props}
        >
            <svg version="1.1" id="L5" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                viewBox="0 0 100 100" enable-background="new 0 0 0 0">
                <circle fill="#b5b5b5" stroke="none" cx="32" cy="50" r="6">
                    <animateTransform
                        attributeName="transform"
                        dur="1s"
                        type="translate"
                        values="0 15 ; 0 -15; 0 15"
                        repeatCount="indefinite"
                        begin="0.1"/>
                </circle>
                <circle fill="#b5b5b5" stroke="none" cx="50" cy="50" r="6">
                    <animateTransform
                        attributeName="transform"
                        dur="1s"
                        type="translate"
                        values="0 10 ; 0 -10; 0 10"
                        repeatCount="indefinite"
                        begin="0.2"/>
                </circle>
                <circle fill="#b5b5b5" stroke="none" cx="68" cy="50" r="6">
                    <animateTransform
                        attributeName="transform"
                        dur="1s"
                        type="translate"
                        values="0 5 ; 0 -5; 0 5"
                        repeatCount="indefinite"
                        begin="0.3"/>
                </circle>
            </svg>

        </Box>
    );
};

export default Loading;
