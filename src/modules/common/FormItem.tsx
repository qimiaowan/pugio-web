import {
    FC,
    useCallback,
    useEffect,
    useState,
    createElement,
} from 'react';
import {
    FormItemEditorProps,
    FormItemProps,
} from '@modules/common/form-item.interface';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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
            font-size: 12px;
        }

        .form-content-wrapper {
            width: 100%;

            .content {
                display: flex;
                align-items: center;

                &.view {
                    border: 1px solid transparent;
                    position: relative;

                    .value-view-text {
                        font-size: 13px;
                        padding: ${theme.spacing(1)};
                        padding-right: 60px;

                        &.multi-line {
                            max-height: 320px;
                        }
                    }

                    .edit-button {
                        display: none;
                        position: absolute;
                        top: 0;
                        right: ${theme.spacing(1)};
                    }

                    &:hover .edit-button {
                        display: flex;
                    }
                }

                &.edit {
                    display: flex;
                    align-items: center;
                    margin-top: ${theme.spacing(1)};

                    .editor-buttons-wrapper {
                        flex-grow: 0;
                        flex-shrink: 0;
                        box-sizing: border-box;
                        padding: 0 ${theme.spacing(1)};
                    }

                    .form-item-input {
                        padding: ${theme.spacing(1)};
                        border-radius: ${theme.shape.borderRadius}px;
                        border: 0;
                        outline: 0;
                        border: 1px solid ${theme.palette.text.secondary};
                        flex-grow: 1;
                        flex-shrink: 0;

                        &:hover {
                            border-color: ${theme.palette.text.primary};
                        }

                        &:focus {
                            border-color: ${theme.palette.primary.main};
                        }
                    }
                }
            }
        }
    `;
});

const DefaultFormItemEditor: FC<FormItemEditorProps> = ({
    value,
    updateValue,
}) => {
    return (
        <input
            className="form-item-input"
            value={value}
            onChange={(event) => updateValue(event.target.value)}
        />
    );
};

const FormItem: FC<FormItemProps> = ({
    title,
    value,
    containerProps = {},
    editable = true,
    titleProps = {},
    valueProps = {},
    helper = null,
    Editor,
    valueRender,
    onValueChange = _.noop,
}) => {
    const [editorValue, setEditorValue] = useState<any>(null);
    const [currentState, setCurrentState] = useState<'view' | 'edit'>('view');

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
                            {
                                _.isFunction(valueRender)
                                    ? (() => {
                                        const renderedValue = valueRender({ value });
                                        if (_.isString(renderedValue)) {
                                            return (
                                                <Typography
                                                    noWrap={true}
                                                    {...valueProps}
                                                    classes={{
                                                        root: clsx(
                                                            'value-view-text',
                                                            valueProps?.classes?.root,
                                                        ),
                                                    }}
                                                >{renderedValue}</Typography>
                                            );
                                        } else {
                                            return renderedValue;
                                        }
                                    })()
                                    : <Typography
                                        noWrap={true}
                                        {...valueProps}
                                        classes={{
                                            root: clsx(
                                                'value-view-text',
                                                valueProps?.classes?.root,
                                            ),
                                        }}
                                    >{value}</Typography>
                            }
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
                                createElement(Editor || DefaultFormItemEditor, {
                                    value: editorValue,
                                    updateValue: setEditorValue,
                                })
                            }
                            <Box className="editor-buttons-wrapper">
                                <IconButton onClick={handleSubmitValue}><Icon className="icon-check" /></IconButton>
                                <IconButton onClick={handleCancelEdit}><Icon className="icon-x" /></IconButton>
                            </Box>
                        </Box>
                }
            </Box>
            {helper}
        </FormItemWrapper>
    );
};

export default FormItem;
