import { lazy } from 'react';
import { Component } from 'khamsa';
import { ClientMenuItemComponent } from './client-menu-item.component';
import { LocaleService } from '@modules/locale/locale.service';
import { StoreService } from '@modules/store/store.service';

@Component({
    component: lazy(() => import('./ClientDashboard')),
    declarations: [
        ClientMenuItemComponent,
        LocaleService,
        StoreService,
    ],
})
export class ClientDashboardComponent {}
