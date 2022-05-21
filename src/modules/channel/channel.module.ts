import { Module } from 'khamsa';
import { ChannelPanelComponent } from '@modules/channel/channel-panel.component';
import { ChannelService } from '@modules/channel/channel.service';
import { ChannelListComponent } from '@modules/channel/channel-list.component';
import { ChannelListItemComponent } from '@modules/channel/channel-list-item.component';
import { ChannelPopoverComponent } from '@modules/channel/channel-popover.component';

@Module({
    providers: [
        ChannelService,
    ],
    components: [
        ChannelPanelComponent,
        ChannelListComponent,
        ChannelListItemComponent,
        ChannelPopoverComponent,
    ],
    exports: [
        ChannelPanelComponent,
        ChannelService,
        ChannelListComponent,
        ChannelListItemComponent,
        ChannelPopoverComponent,
    ],
})
export class ChannelModule {}
