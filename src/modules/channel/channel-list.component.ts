import { Component } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import { ChannelService } from '@modules/channel/channel.service';
import { UtilsService } from '@modules/utils/utils.service';
import { LoadingComponent } from '@modules/brand/loading.component';
import { ChannelListItemComponent } from '@modules/channel/channel-list-item.component';
import ChannelList from '@modules/channel/ChannelList';

@Component({
    factory: () => ChannelList,
    declarations: [
        LocaleService,
        ChannelService,
        UtilsService,
        LoadingComponent,
        ChannelListItemComponent,
    ],
})
export class ChannelListComponent {}
