import { PropsWithChildren } from 'react';
import { BoxProps } from '@mui/material/Box';

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EmptyProps extends PropsWithChildren<EmptyProps>, BoxProps {
    title?: string;
    subTitle?: string;
}
