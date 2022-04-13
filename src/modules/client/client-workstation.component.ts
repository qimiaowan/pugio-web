import { Component } from 'khamsa';
import { lazy } from 'react';
import { LocaleService } from '@modules/locale/locale.service';
import { TabComponent } from '@modules/tab/tab.component';
import { StoreService } from '@modules/store/store.service';
import { ChannelPanelComponent } from '@modules/channel/channel-panel.component';

@Component({
    component: lazy(() => import('@modules/client/ClientWorkstation')),
    declarations: [
        TabComponent,
        ChannelPanelComponent,
        LocaleService,
        StoreService,
    ],
})
export class ClientWorkstationComponent {}
