import { lazy } from 'react';
import { Component } from 'khamsa';
import { ClientMenuItemComponent } from '@modules/client/client-menu-item.component';
import { LocaleService } from '@modules/locale/locale.service';
import { StoreService } from '@modules/store/store.service';
import { ClientService } from '@modules/client/client.service';
import { ChannelPopoverComponent } from '@modules/channel/channel-popover.component';

@Component({
    component: lazy(() => import('@modules/client/ClientDashboard')),
    declarations: [
        ClientMenuItemComponent,
        LocaleService,
        StoreService,
        ClientService,
        ChannelPopoverComponent,
    ],
})
export class ClientDashboardComponent {}
