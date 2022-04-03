import { lazy } from 'react';
import { Component } from 'khamsa';

@Component({
    component: lazy(() => import('./ClientDashboard')),
})
export class ClientDashboardComponent {}
