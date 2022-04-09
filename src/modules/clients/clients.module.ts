import { Module } from 'khamsa';
import { ClientDashboardComponent } from '@modules/clients/client-dashboard.component';
import { ClientMenuItemComponent } from '@modules/clients/client-menu-item.component';
import { ClientWorkstationComponent } from '@modules/clients/client-workstation.component';
import { ClientsDropdownComponent } from '@modules/clients/clients-dropdown.component';
import { ClientsService } from '@modules/clients/clients.service';

const TabModule = import('@modules/tab/tab.module').then(({ TabModule }) => TabModule);
const StoreModule = import('@modules/store/store.module').then(({ StoreModule }) => StoreModule);

@Module({
    imports: [
        TabModule,
        StoreModule,
    ],
    providers: [
        ClientsService,
    ],
    components: [
        ClientsDropdownComponent,
        ClientDashboardComponent,
        ClientMenuItemComponent,
        ClientWorkstationComponent,
    ],
    exports: [
        ClientsDropdownComponent,
        ClientDashboardComponent,
        ClientMenuItemComponent,
        ClientWorkstationComponent,
        ClientsService,
    ],
    routes: [
        {
            path: ':client_id',
            useComponentClass: ClientDashboardComponent,
            children: [
                {
                    path: 'workstation',
                    useComponentClass: ClientWorkstationComponent,
                },
            ],
        },
    ],
})
export class ClientsModule {}
