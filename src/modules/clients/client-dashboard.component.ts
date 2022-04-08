import { lazy } from 'react';
import { Component } from 'khamsa';
import { ClientMenuItemComponent } from '@modules/clients/client-menu-item.component';
import { LocaleService } from '@modules/locale/locale.service';
import { StoreService } from '@modules/store/store.service';

@Component({
    component: lazy(() => import('@modules/clients/ClientDashboard')),
    declarations: [
        ClientMenuItemComponent,
        LocaleService,
        StoreService,
    ],
})
export class ClientDashboardComponent {}
