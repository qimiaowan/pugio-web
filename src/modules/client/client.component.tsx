import { Component } from 'khamsa';
import { Navigate } from 'react-router-dom';

@Component({
    component: () => <Navigate to="/clients/list" />,
})
export class ClientComponent {}
