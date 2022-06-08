import { TextFieldProps } from '@mui/material/TextField';
import { TypographyProps } from '@mui/material/Typography';
import {
    DetailedHTMLProps,
    TextareaHTMLAttributes,
} from 'react';

export interface FormItemProps {
    title: string;
    value: string;
    className?: string;
    editable?: boolean;
    editorType?: 'text-field' | 'text-area';
    titleProps?: TypographyProps;
    valueProps?: TypographyProps;
    editorTextFieldProps?: TextFieldProps;
    editorTextAreaProps?: DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>
    onValueChange?: (value: any) => void;
}
