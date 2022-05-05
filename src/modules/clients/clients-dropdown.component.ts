import { Component } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import ClientsDropdown from '@modules/clients/ClientsDropdown';
import { ClientsService } from '@modules/clients/clients.service';
import { LoadingComponent } from '@modules/brand/loading.component';
import { ExceptionComponent } from '@modules/brand/exception.component';
import { UtilsService } from '@modules/utils/utils.service';
import { ClientService } from '@modules/client/client.service';

@Component({
    component: ClientsDropdown,
    declarations: [
        LocaleService,
        ClientsService,
        LoadingComponent,
        ExceptionComponent,
        UtilsService,
        ClientService,
    ],
})
export class ClientsDropdownComponent {}
