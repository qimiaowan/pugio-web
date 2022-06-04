import { Component } from 'khamsa';
import ClientRoleSelector from '@modules/client/ClientRoleSelector';
import { LocaleService } from '@modules/locale/locale.service';
import { PopoverComponent } from '@modules/common/popover.component';

@Component({
    factory: () => ClientRoleSelector,
    declarations: [
        LocaleService,
        PopoverComponent,
    ],
})
export class ClientRoleSelectorComponent {}
