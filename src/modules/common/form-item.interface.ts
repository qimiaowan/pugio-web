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

export type FormItemEditor = FC<FormItemEditorProps>;
export type FormItemValueRender = (data: FormItemRenderData) => string | ReactNode;

export interface FormItemProps {
    title: string;
    value: string;
    containerProps?: BoxProps;
    editable?: boolean;
    titleProps?: TypographyProps;
    valueProps?: TypographyProps;
    helper?: ReactNode;
    Editor?: FormItemEditor;
    valueRender?: FormItemValueRender;
    onValueChange?: (value: any) => void;
}
