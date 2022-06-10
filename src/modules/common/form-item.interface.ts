import { BoxProps } from '@mui/material/Box';
import { TextFieldProps } from '@mui/material/TextField';
import { TypographyProps } from '@mui/material/Typography';
import {
    DetailedHTMLProps,
    ReactNode,
    TextareaHTMLAttributes,
} from 'react';

export type FormItemEditorType =
    | 'text'
    | 'longText'
    | 'number'
    | 'multipleSelect'
    | 'singleSelect'
    | 'datetime'
    | 'datetimeRange'
    | 'password'
    | 'file'
    | 'color';

export interface FormItemProps {
    title: string;
    value: string;
    containerProps?: BoxProps;
    editable?: boolean;
    editorType?: 'text-field' | 'text-area';
    titleProps?: TypographyProps;
    valueProps?: TypographyProps;
    extra?: ReactNode;
    editorTextFieldProps?: TextFieldProps;
    editorTextAreaProps?: DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>
    onValueChange?: (value: any) => void;
}
