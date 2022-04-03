import {
    FC,
} from 'react';
import Box from '@mui/material/Box';
import './client-dashboard.component.less';

const ClientDashboard: FC = () => {
    return (
        <Box className="client-dashboard-container">
            <Box className="sidebar"></Box>
            <Box className="content-container"></Box>
        </Box>
    );
};

export default ClientDashboard;
