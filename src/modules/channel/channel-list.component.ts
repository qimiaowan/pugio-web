import { lazy } from 'react';
import { Component } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import { ChannelService } from '@modules/channel/channel.service';
import { UtilsService } from '@modules/utils/utils.service';
import { LoadingComponent } from '@modules/brand/loading.component';

const ChannelList = lazy(() => import('@/modules/channel/ChannelList'));

@Component({
    component: ChannelList,
    declarations: [
        LocaleService,
        ChannelService,
        UtilsService,
        LoadingComponent,
    ],
})
export class ChannelListComponent {}
