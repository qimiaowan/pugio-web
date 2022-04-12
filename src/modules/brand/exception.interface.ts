import { PropsWithChildren } from 'react';
import { BoxProps } from '@mui/material/Box';

export interface ExceptionComponentProps {
    imageSrc?: string;
    title?: string;
    subTitle?: string;
}

export interface ExceptionProps extends PropsWithChildren<ExceptionComponentProps>, BoxProps {}
