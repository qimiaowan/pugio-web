import { Module } from 'khamsa';
import { ChannelPanelComponent } from '@modules/channel/channel-panel.component';

@Module({
    components: [
        ChannelPanelComponent,
    ],
    exports: [
        ChannelPanelComponent,
    ],
})
export class ChannelModule {}
