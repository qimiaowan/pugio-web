import { Component } from 'khamsa';
import { lazy } from 'react';
import { LocaleService } from '@modules/locale/locale.service';
import { TabComponent } from '@modules/tab/tab.component';
import { StoreService } from '@modules/store/store.service';

@Component({
    component: lazy(() => import('@modules/client/ClientWorkstation')),
    declarations: [
        TabComponent,
        LocaleService,
        StoreService,
    ],
})
export class ClientWorkstationComponent {}
