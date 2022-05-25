import { Component } from 'khamsa';
import ClientRoleSelector from '@modules/client/ClientRoleSelector';
import { LocaleService } from '@modules/locale/locale.service';

@Component({
    component: ClientRoleSelector,
    declarations: [
        LocaleService,
    ],
})
export class ClientRoleSelectorComponent {}
