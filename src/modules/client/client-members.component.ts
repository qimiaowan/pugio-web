import { Component } from 'khamsa';
import { lazy } from 'react';
import { LocaleService } from '@modules/locale/locale.service';
import { StoreService } from '@modules/store/store.service';
import { UserSelectorComponent } from '@modules/user/user-selector.component';
import { UserService } from '@modules/user/user.service';

@Component({
    component: lazy(() => import('@modules/client/ClientWorkstation')),
    declarations: [
        UserService,
        StoreService,
        LocaleService,
        UserSelectorComponent,
    ],
})
export class ClientMembersComponent {}
