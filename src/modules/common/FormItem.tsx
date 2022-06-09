import {
    FC,
    useCallback,
    useEffect,
    useState,
} from 'react';
import { FormItemProps } from '@modules/common/form-item.interface';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import clsx from 'clsx';
import styled from '@mui/material/styles/styled';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import _ from 'lodash';

const FormItemWrapper = styled(Box)(({ theme }) => {
    return `
        display: flex;
        flex-direction: column;
        align-items: center;

        &, * {
            user-select: none;
        }

        .title {
            width: 100%;
            font-weight: 700;
            padding-left: ${theme.spacing(1)};
            padding-right: ${theme.spacing(1)};
        }

        .form-content-wrapper {
            width: 100%;

            .content {
                display: flex;
                align-items: stretch;

                &.view {
                    border: 1px solid transparent;

                    .value-view-text {
                        font-size: 13px;
                        padding: ${theme.spacing(1)};
                    }

                    .edit-button {
                        display: none;
                    }

                    &:hover .edit-button {
                        display: flex;
                    }
                }

                &.edit {
                    display: flex;
                    align-items: flex-start;

                    .editor-text-field, .editor-text-area {
                        flex-grow: 1;
                        flex-shrink: 1;
                        margin-right: ${theme.spacing(1)};
                    }

                    .editor-text-field .input {
                        padding: ${theme.spacing(0.6)} 0;
                    }

                    .editor-text-area, .editor-text-field .input {
                        font-size: 13px;
                        color: ${theme.palette.mode === 'dark' ? 'white' : 'black'};
                    }

                    .editor-text-area {
                        height: 320px;
                        resize: none;
                        box-sizing: border-box;
                        outline: 0;
                        padding: ${theme.spacing(0.8)};
                        border: 1px solid ${theme.palette.text.secondary};
                        border-radius: ${theme.shape.borderRadius}px;
                        font-family: inherit;

                        &:hover {
                            border: 1px solid ${theme.palette.text.primary};
                        }

                        &:focus {
                            border: 1px solid ${theme.palette.primary.main};
                        }
                    }

                    .editor-buttons-wrapper {
                        flex-grow: 0;
                        flex-shrink: 0;
                    }
                }
            }
        }
    `;
});

const FormItem: FC<FormItemProps> = ({
    title,
    value,
    containerProps = {},
    titleProps = {},
    valueProps = {},
    editorTextFieldProps = {},
    editorTextAreaProps = {},
    editable = true,
    editorType = 'text-field',
    extra = null,
    onValueChange = _.noop,
}) => {
    const [editorValue, setEditorValue] = useState<any>(null);
    const [currentState, setCurrentState] = useState<'view' | 'edit'>('view');
    const [textFieldElement, setTextFieldElement] = useState<HTMLInputElement>(null);
    const [textAreaElement, setTextAreaElement] = useState<HTMLTextAreaElement>(null);

    const handleSubmitValue = useCallback(() => {
        onValueChange(editorValue);
        setCurrentState('view');
    }, [editorValue]);

    const handleCancelEdit = useCallback(() => {
        setEditorValue(value);
        setCurrentState('view');
    }, [value]);

    useEffect(() => {
        setEditorValue(value);
    }, [value]);

    useEffect(() => {
        if (textFieldElement) {
            textFieldElement.focus();
        }
        if (textAreaElement) {
            textAreaElement.focus();
        }
    }, [textFieldElement, textAreaElement]);

    return (
        <FormItemWrapper
            {...containerProps}
            className={clsx(containerProps?.className)}
        >
            <Typography
                color="text.secondary"
                noWrap={true}
                {...titleProps}
                classes={{
                    root: clsx('title', titleProps?.classes?.root),
                }}
            >{title}</Typography>
            <Box className="form-content-wrapper">
                {
                    currentState === 'view'
                        ? <Box className="content view">
                            <Typography
                                {...valueProps}
                                noWrap={true}
                                classes={{ root: clsx('value-view-text', valueProps?.classes?.root) }}
                            >{value}</Typography>
                            {
                                editable && (
                                    <IconButton
                                        classes={{ root: 'edit-button' }}
                                        onClick={() => setCurrentState('edit')}
                                    ><Icon className="icon-edit-3" /></IconButton>
                                )
                            }
                        </Box>
                        : <Box className="content edit">
                            {
                                editorType === 'text-field'
                                    ? <TextField
                                        {...editorTextFieldProps}
                                        inputRef={(ref) => setTextFieldElement(ref)}
                                        value={editorValue}
                                        classes={{
                                            root: clsx('editor-text-field', editorTextFieldProps?.classes?.root),
                                        }}
                                        InputProps={{
                                            classes: {
                                                root: 'input',
                                            },
                                            ...(editorTextFieldProps?.InputProps || {}),
                                        }}
                                        onChange={(event) => setEditorValue(event.target.value)}
                                    />
                                    : <textarea
                                        {...editorTextAreaProps}
                                        ref={(ref) => setTextAreaElement(ref)}
                                        className={clsx('editor-text-area', editorTextAreaProps?.className)}
                                        value={editorValue}
                                        onChange={(event) => setEditorValue(event.target.value)}
                                    ></textarea>
                            }
                            <Box className="editor-buttons-wrapper">
                                <IconButton
                                    onClick={handleSubmitValue}
                                ><Icon className="icon-check" /></IconButton>
                                <IconButton onClick={handleCancelEdit}><Icon className="icon-x" /></IconButton>
                            </Box>
                        </Box>
                }
            </Box>
            {extra}
        </FormItemWrapper>
    );
};

export default FormItem;
