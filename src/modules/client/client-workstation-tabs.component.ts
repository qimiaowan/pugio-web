import { lazy } from 'react';
import { Component } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import { TabComponent } from '@modules/tab/tab.component';
import { StoreService } from '@modules/store/store.service';
import { ClientService } from '@modules/client/client.service';
import { ChannelService } from '@modules/channel/channel.service';
import { UtilsService } from '@modules/utils/utils.service';
import { AppComponent as WebTerminalAppComponent } from '@builtin:web-terminal/app.component';
import { ChannelListComponent } from '@modules/channel/channel-list.component';
import { PopoverComponent } from '@modules/common/popover.component';

@Component({
    component: lazy(() => import('@modules/client/ClientWorkstationTabs')),
    declarations: [
        TabComponent,
        LocaleService,
        StoreService,
        ClientService,
        ChannelService,
        UtilsService,
        WebTerminalAppComponent,
        ChannelListComponent,
        PopoverComponent,
    ],
})
export class ClientWorkstationTabsComponent {}
