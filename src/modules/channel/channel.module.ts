import { Module } from 'khamsa';
import { ChannelPanelComponent } from '@modules/channel/channel-panel.component';
import { ChannelService } from '@modules/channel/channel.service';
import { ChannelListComponent } from '@modules/channel/channel-list.component';

@Module({
    providers: [
        ChannelService,
    ],
    components: [
        ChannelPanelComponent,
        ChannelListComponent,
    ],
    exports: [
        ChannelPanelComponent,
        ChannelService,
        ChannelListComponent,
    ],
})
export class ChannelModule {}
