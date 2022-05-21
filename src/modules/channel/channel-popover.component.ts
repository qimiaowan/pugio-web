import { Component } from 'khamsa';
import ChannelPopover from '@modules/channel/ChannelPopover';
import { ChannelListComponent } from '@modules/channel/channel-list.component';

@Component({
    component: ChannelPopover,
    declarations: [
        ChannelListComponent,
    ],
})
export class ChannelPopoverComponent {}
