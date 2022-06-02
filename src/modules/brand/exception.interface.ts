import { PropsWithChildren } from 'react';
import { BoxProps } from '@mui/material/Box';

export type ExceptionType = 'empty'
    | 'error'
    | 'forbidden'
    | 'logo'
    | 'notSupported'
    | 'welcome';

export interface ExceptionComponentProps {
    type?: ExceptionType;
    title?: string;
    subTitle?: string;
    imageClassName?: string;
    imageProps?: BoxProps;
}

export interface ExceptionProps extends PropsWithChildren<ExceptionComponentProps>, BoxProps {}
