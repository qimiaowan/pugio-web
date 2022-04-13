import { Module } from 'khamsa';
import { ChannelPanelComponent } from '@modules/channel/channel-panel.component';
import { ChannelService } from '@modules/channel/channel.service';

@Module({
    providers: [
        ChannelService,
    ],
    components: [
        ChannelPanelComponent,
    ],
    exports: [
        ChannelPanelComponent,
        ChannelService,
    ],
})
export class ChannelModule {}
