import { Module } from 'khamsa';
import { ClientDashboardComponent } from './client-dashboard.component';
import { ClientMenuItemComponent } from './client-menu-item.component';
import { ClientWorkstationComponent } from './client-workstation.component';
import { ClientsDropdownComponent } from './clients-dropdown.component';

const TabModule = import('@modules/tab/tab.module').then(({ TabModule }) => TabModule);
const StoreModule = import('@modules/store/store.module').then(({ StoreModule }) => StoreModule);

@Module({
    imports: [
        TabModule,
        StoreModule,
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
