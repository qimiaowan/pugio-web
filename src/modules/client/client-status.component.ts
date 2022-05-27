import { Component } from 'khamsa';
import { lazy } from 'react';
import { ExceptionComponent } from '@modules/brand/exception.component';
import { LocaleService } from '@modules/locale/locale.service';

@Component({
    component: lazy(() => import('@modules/client/ClientStatus')),
    declarations: [
        ExceptionComponent,
        LocaleService,
    ],
})
export class ClientStatusComponent {}
