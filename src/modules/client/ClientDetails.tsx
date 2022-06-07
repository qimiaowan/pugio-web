import { FC } from 'react';
import Box from '@mui/material/Box';
import styled from '@mui/material/styles/styled';
import SimpleBar from 'simplebar-react';

const ClientDetailsPage = styled(Box)(() => {
    return `
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        align-items: center;

        .form-wrapper {
            width: 720px;
        }
    `;
});

const ClientDetails: FC = () => {
    return (
        <ClientDetailsPage>
            <SimpleBar style={{ width: 720, height: '100%' }}>
                <Box className="">
                    {
                        new Array(300).fill(null).map(() => {
                            return <p>{Math.random().toString(32).slice(1)}</p>;
                        })
                    }
                </Box>
                <h1>EOF</h1>
            </SimpleBar>
        </ClientDetailsPage>
    );
};

export default ClientDetails;
