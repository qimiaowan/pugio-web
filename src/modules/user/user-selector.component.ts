import { Component } from 'khamsa';
import { lazy } from 'react';
import { LocaleService } from '@modules/locale/locale.service';
import { UtilsService } from '@modules/utils/utils.service';
import { UserService } from '@modules/user/user.service';
import { UserCardComponent } from '@modules/user/user-card.component';
import { LoadingComponent } from '@modules/brand/loading.component';
import { ExceptionComponent } from '@modules/brand/exception.component';
import { ClientRoleSelectorComponent } from '@modules/client/client-role-selector.component';

@Component({
    factory: (forwardRef) => lazy(() => forwardRef(import('@modules/user/UserSelector'))),
    declarations: [
        UtilsService,
        LocaleService,
        UserService,
        UserCardComponent,
        LoadingComponent,
        ExceptionComponent,
        ClientRoleSelectorComponent,
    ],
})
export class UserSelectorComponent {}
