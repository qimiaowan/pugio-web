import { lazy } from 'react';
import { Component } from 'khamsa';
import { ClientMenuItemComponent } from '@modules/client/client-menu-item.component';
import { LocaleService } from '@modules/locale/locale.service';
import { StoreService } from '@modules/store/store.service';
import { ClientService } from '@modules/client/client.service';
import { LoadingComponent } from '@modules/brand/loading.component';
import { ExceptionComponent } from '@modules/brand/exception.component';

@Component({
    factory: (forwardRef) => {
        return lazy(() => {
            return forwardRef(import('@modules/client/ClientDashboard'));
        });
    },
    declarations: [
        ClientMenuItemComponent,
        LocaleService,
        StoreService,
        ClientService,
        LoadingComponent,
        ExceptionComponent,
    ],
})
export class ClientDashboardComponent {}
