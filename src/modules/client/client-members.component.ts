import { Component } from 'khamsa';
import { lazy } from 'react';
import { LocaleService } from '@modules/locale/locale.service';
import { StoreService } from '@modules/store/store.service';
import { UserSelectorComponent } from '@modules/user/user-selector.component';
import { ClientService } from '@modules/client/client.service';
import { UtilsService } from '@modules/utils/utils.service';
import { LoadingComponent } from '@modules/brand/loading.component';
import { ExceptionComponent } from '@modules/brand/exception.component';
import { UserCardComponent } from '@modules/user/user-card.component';
import { ConfigService } from '@modules/config/config.service';
import { ClientRoleSelectorComponent } from '@modules/client/client-role-selector.component';

@Component({
    component: lazy(() => import('@modules/client/ClientMembers')),
    declarations: [
        StoreService,
        LocaleService,
        UserSelectorComponent,
        ClientService,
        UtilsService,
        LoadingComponent,
        ExceptionComponent,
        UserCardComponent,
        ConfigService,
        ClientRoleSelectorComponent,
    ],
})
export class ClientMembersComponent {}
