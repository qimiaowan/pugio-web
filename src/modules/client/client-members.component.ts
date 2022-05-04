import { Component } from 'khamsa';
import { lazy } from 'react';
import { LocaleService } from '@modules/locale/locale.service';
import { StoreService } from '@modules/store/store.service';
import { UserSelectorComponent } from '@modules/user/user-selector.component';
import { ClientService } from '@modules/client/client.service';
import { UtilsService } from '@modules/utils/utils.service';

@Component({
    component: lazy(() => import('@modules/client/ClientMembers')),
    declarations: [
        StoreService,
        LocaleService,
        UserSelectorComponent,
        ClientService,
        UtilsService,
    ],
})
export class ClientMembersComponent {}
