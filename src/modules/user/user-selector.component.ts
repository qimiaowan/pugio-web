import { Component } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import { UtilsService } from '@modules/utils/utils.service';
import { UserService } from '@modules/user/user.service';
import { UserCardComponent } from '@modules/user/user-card.component';
import { LoadingComponent } from '@modules/brand/loading.component';
import { ExceptionComponent } from '@modules/brand/exception.component';
import { ClientRoleSelectorComponent } from '@modules/client/client-role-selector.component';
import UserSelector from '@modules/user/UserSelector';

@Component({
    factory: () => UserSelector,
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
