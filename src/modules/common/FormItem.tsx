/* eslint-disable no-unused-vars */
import {
    FC,
    useEffect,
    useState,
} from 'react';
import { FormItemProps } from '@modules/common/form-item.interface';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import styled from '@mui/material/styles/styled';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';

const FormItemWrapper = styled(Box)(() => {
    return `
        display: flex;
        align-items: center;

        .title {
            width: 180px;
        }
    `;
});

const FormItem: FC<FormItemProps> = ({
    title,
    value,
    className = '',
    titleProps = {},
    valueProps = {},
    editable = true,
    editorType = 'text-field',
}) => {
    const [currentValue, setCurrentValue] = useState<any>(null);

    useEffect(() => {
        setCurrentValue(value);
    }, [value]);

    return (
        <FormItemWrapper className={clsx(className)}>
            <Typography
                color="text.secondary"
                noWrap={true}
                {...titleProps}
                classes={{
                    root: clsx('title', titleProps?.classes?.root),
                }}
            >{title}</Typography>
            {
                editable
                    ? editorType === 'text-field'
                        ? <></>
                        : <></>
                    : <Box>
                        <Typography></Typography>
                        <IconButton><Icon className="" /></IconButton>
                    </Box>
            }
        </FormItemWrapper>
    );
};

export default FormItem;
