import { Module } from 'khamsa';
import { ClientDashboardComponent } from './client-dashboard.component';
import { ClientsDropdownComponent } from './clients-dropdown.component';

@Module({
    components: [
        ClientsDropdownComponent,
        ClientDashboardComponent,
    ],
    exports: [
        ClientsDropdownComponent,
        ClientDashboardComponent,
    ],
    routes: [
        {
            path: ':client_id',
            useComponentClass: ClientDashboardComponent,
        },
    ],
})
export class ClientsModule {}
