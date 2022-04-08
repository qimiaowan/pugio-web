import { Component } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import ClientsDropdown from '@modules/clients/ClientsDropdown';

@Component({
    component: ClientsDropdown,
    declarations: [
        LocaleService,
    ],
})
export class ClientsDropdownComponent {}
