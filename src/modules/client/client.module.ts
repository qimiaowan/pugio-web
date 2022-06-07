import { Module } from 'khamsa';
import { ClientDashboardComponent } from '@modules/client/client-dashboard.component';
import { ClientMenuItemComponent } from '@modules/client/client-menu-item.component';
import { ClientWorkstationComponent } from '@modules/client/client-workstation.component';
import { ClientService } from '@modules/client/client.service';
import { ClientComponent } from '@modules/client/client.component';
import { ClientMembersComponent } from '@modules/client/client-members.component';
import { ClientRoleSelectorComponent } from '@modules/client/client-role-selector.component';
import { ClientStatusComponent } from '@modules/client/client-status.component';
import { ClientDetailsComponent } from '@modules/client/client-details.component';

const TabModule = import('@modules/tab/tab.module').then(({ TabModule }) => TabModule);
const StoreModule = import('@modules/store/store.module').then(({ StoreModule }) => StoreModule);
const ChannelModule = import('@modules/channel/channel.module').then(({ ChannelModule }) => ChannelModule);

@Module({
    imports: [
        TabModule,
        StoreModule,
        ChannelModule,
    ],
    providers: [
        ClientService,
    ],
    components: [
        ClientDashboardComponent,
        ClientMenuItemComponent,
        ClientWorkstationComponent,
        ClientComponent,
        ClientMembersComponent,
        ClientRoleSelectorComponent,
        ClientStatusComponent,
        ClientDetailsComponent,
    ],
    routes: [
        {
            path: '',
            useComponentClass: ClientComponent,
        },
        {
            path: ':client_id',
            useComponentClass: ClientDashboardComponent,
            children: [
                {
                    path: 'workstation',
                    useComponentClass: ClientWorkstationComponent,
                },
                {
                    path: 'members',
                    useComponentClass: ClientMembersComponent,
                },
                {
                    path: 'status',
                    useComponentClass: ClientStatusComponent,
                },
                {
                    path: 'details',
                    useComponentClass: ClientDetailsComponent,
                },
            ],
        },
    ],
    exports: [
        ClientService,
        ClientRoleSelectorComponent,
    ],
})
export class ClientModule {}
