import { Component } from 'khamsa';
import { lazy } from 'react';
import { LocaleService } from '@modules/locale/locale.service';
import { TabComponent } from '@modules/tab/tab.component';

@Component({
    component: lazy(() => import('./ClientWorkstation')),
    declarations: [
        TabComponent,
        LocaleService,
    ],
})
export class ClientWorkstationComponent {}
