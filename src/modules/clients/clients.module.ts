import { Module } from 'khamsa';
import { ClientDashboardComponent } from './client-dashboard.component';
import { ClientMenuItemComponent } from './client-menu-item.component';
import { ClientsDropdownComponent } from './clients-dropdown.component';

@Module({
    components: [
        ClientsDropdownComponent,
        ClientDashboardComponent,
        ClientMenuItemComponent,
    ],
    exports: [
        ClientsDropdownComponent,
        ClientDashboardComponent,
        ClientMenuItemComponent,
    ],
    routes: [
        {
            path: ':client_id',
            useComponentClass: ClientDashboardComponent,
        },
    ],
})
export class ClientsModule {}
