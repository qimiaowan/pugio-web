import { Component } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import ClientsDropdown from '@modules/clients/ClientsDropdown';
import { ClientsService } from './clients.service';

@Component({
    component: ClientsDropdown,
    declarations: [
        LocaleService,
        ClientsService,
    ],
})
export class ClientsDropdownComponent {}
