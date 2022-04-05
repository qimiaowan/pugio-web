import { lazy } from 'react';
import { Component } from 'khamsa';
import { ClientMenuItemComponent } from './client-menu-item.component';
import { LocaleService } from '../locale/locale.service';

@Component({
    component: lazy(() => import('./ClientDashboard')),
    declarations: [
        ClientMenuItemComponent,
        LocaleService,
    ],
})
export class ClientDashboardComponent {}
