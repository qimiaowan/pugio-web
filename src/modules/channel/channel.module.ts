import { Module } from 'khamsa';
import { ChannelPanelComponent } from '@modules/channel/channel-panel.component';
import { ChannelService } from '@modules/channel/channel.service';
import { ChannelListComponent } from '@modules/channel/channel-list.component';
import { ChannelListItemComponent } from '@modules/channel/channel-list-item.component';

@Module({
    providers: [
        ChannelService,
    ],
    components: [
        ChannelPanelComponent,
        ChannelListComponent,
        ChannelListItemComponent,
    ],
    exports: [
        ChannelPanelComponent,
        ChannelService,
        ChannelListComponent,
        ChannelListItemComponent,
    ],
})
export class ChannelModule {}
