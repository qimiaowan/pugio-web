import { Module } from 'khamsa';
import { ClientsDropdownComponent } from '@modules/clients/clients-dropdown.component';
import { ClientsService } from '@modules/clients/clients.service';

const TabModule = import('@modules/tab/tab.module').then(({ TabModule }) => TabModule);

@Module({
    imports: [
        TabModule,
    ],
    providers: [
        ClientsService,
    ],
    components: [
        ClientsDropdownComponent,
    ],
    exports: [
        ClientsDropdownComponent,
        ClientsService,
    ],
})
export class ClientsModule {}
