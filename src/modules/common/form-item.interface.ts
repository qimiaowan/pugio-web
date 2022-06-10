import { BoxProps } from '@mui/material/Box';
import { TypographyProps } from '@mui/material/Typography';
import {
    FC,
    ReactNode,
} from 'react';

export interface FormItemRenderData {
    value: any;
}

export interface FormItemEditorProps {
    value: any;
    updateValue: (value: any) => void;
}

export interface FormItemProps {
    title: string;
    value: string;
    containerProps?: BoxProps;
    editable?: boolean;
    titleProps?: TypographyProps;
    valueProps?: TypographyProps;
    helper?: ReactNode;
    Editor?: FC<FormItemEditorProps>;
    valueRender?: (data: FormItemRenderData) => string | ReactNode;
    onValueChange?: (value: any) => void;
}
