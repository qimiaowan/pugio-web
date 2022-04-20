import { lazy } from 'react';
import { Component } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import { ChannelService } from '@modules/channel/channel.service';
import { UtilsService } from '@modules/utils/utils.service';

const ChannelList = lazy(() => import('@modules/client/ChannelList'));

@Component({
    component: ChannelList,
    declarations: [
        LocaleService,
        ChannelService,
        UtilsService,
    ],
})
export class ChannelListComponent {}
