import { Component } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import { UserCardComponent } from '@modules/user/user-card.component';
import { ExceptionComponent } from '@modules/brand/exception.component';
import { ClientRoleSelectorComponent } from '@modules/client/client-role-selector.component';
import UserSelector from '@modules/user/UserSelector';
import { UserSearcherComponent } from '@modules/user/user-searcher.component';

@Component({
    factory: () => UserSelector,
    declarations: [
        LocaleService,
        UserCardComponent,
        ExceptionComponent,
        ClientRoleSelectorComponent,
        UserSearcherComponent,
    ],
})
export class UserSelectorComponent {}
