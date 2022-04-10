import { Component } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import ClientsDropdown from '@modules/clients/ClientsDropdown';
import { ClientsService } from '@modules/clients/clients.service';
import { LoadingComponent } from '@modules/brand/loading.component';
import { EmptyComponent } from '@modules/brand/empty.component';

@Component({
    component: ClientsDropdown,
    declarations: [
        LocaleService,
        ClientsService,
        LoadingComponent,
        EmptyComponent,
    ],
})
export class ClientsDropdownComponent {}
