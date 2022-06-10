import {
    FC,
    useEffect,
    useState,
    createElement,
} from 'react';
import { FormItemProps } from '@modules/common/form-item.interface';
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
                        top: ${theme.spacing(1)};
                        right: ${theme.spacing(1)};
                    }

                    &:hover .edit-button {
                        display: flex;
                    }
                }

                &.edit {
                    display: flex;
                    align-items: flex-start;

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
                        : createElement(Editor, {
                            value: editorValue,
                            updateValue: setEditorValue,
                        })
                }
            </Box>
            {helper}
        </FormItemWrapper>
    );
};

export default FormItem;
