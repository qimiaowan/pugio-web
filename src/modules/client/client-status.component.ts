import { Component } from 'khamsa';
import { lazy } from 'react';
import { ExceptionComponent } from '@modules/brand/exception.component';
import { LocaleService } from '@modules/locale/locale.service';
import { StoreService } from '@modules/store/store.service';
import { ClientService } from '@modules/client/client.service';
import { LoadingComponent } from '../brand/loading.component';

@Component({
    component: lazy(() => import('@modules/client/ClientStatus')),
    declarations: [
        ExceptionComponent,
        LocaleService,
        StoreService,
        ClientService,
        LoadingComponent,
    ],
})
export class ClientStatusComponent {}
