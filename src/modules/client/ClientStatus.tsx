import Box from '@mui/material/Box';
import styled from '@mui/material/styles/styled';
import { InjectedComponentProps } from 'khamsa';
import { FC } from 'react';

const StyledBox = styled(Box)(({ theme }) => {
    return `
        width: 100%;
        display: flex;
        flex-direction: column;
    `;
});

const ClientStatus: FC<InjectedComponentProps> = ({
    declarations,
}) => {
    return (
        <StyledBox></StyledBox>
    );
};

export default ClientStatus;
