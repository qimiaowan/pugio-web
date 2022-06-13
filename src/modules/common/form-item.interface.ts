import { BoxProps } from '@mui/material/Box';
import { TypographyProps } from '@mui/material/Typography';
import { FormHelperTextProps } from '@mui/material/FormHelperText';
import {
    FC,
    ReactNode,
} from 'react';

export interface FormItemRenderData {
    value: any;
    changeMode: (mode: 'view' | 'edit') => void;
}

export interface FormItemEditorProps {
    value: any;
    updateValue: (value: any) => void;
}

export type FormItemEditor = FC<FormItemEditorProps>;
export type FormItemValueRender = (data: FormItemRenderData) => ReactNode;

export interface FormItemProps {
    title: string;
    value: string;
    containerProps?: BoxProps;
    editable?: boolean;
    helper?: ReactNode;
    Editor?: FormItemEditor;
    titleProps?: TypographyProps;
    valueProps?: TypographyProps;
    helperProps?: FormHelperTextProps;
    valueRender?: FormItemValueRender;
    onValueChange?: (value: any) => void;
}
