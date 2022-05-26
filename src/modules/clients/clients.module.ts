import { Module } from 'khamsa';
import { ClientsDropdownComponent } from '@modules/clients/clients-dropdown.component';
import { ClientsService } from '@modules/clients/clients.service';
import { StoreModule } from '@modules/store/store.module';

const TabModule = import('@modules/tab/tab.module').then(({ TabModule }) => TabModule);
const ClientModule = import('@modules/client/client.module').then(({ ClientModule }) => ClientModule);

@Module({
    imports: [
        TabModule,
        ClientModule,
        StoreModule,
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
