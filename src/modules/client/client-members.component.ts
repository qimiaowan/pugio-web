import { Component } from 'khamsa';
import { lazy } from 'react';
import { LocaleService } from '@modules/locale/locale.service';
import { StoreService } from '@modules/store/store.service';
import { UserSelectorComponent } from '@modules/user/user-selector.component';
import { ClientService } from '@modules/client/client.service';

@Component({
    component: lazy(() => import('@modules/client/ClientWorkstation')),
    declarations: [
        StoreService,
        LocaleService,
        UserSelectorComponent,
        ClientService,
    ],
})
export class ClientMembersComponent {}
