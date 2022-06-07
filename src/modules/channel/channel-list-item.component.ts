import { Component } from 'khamsa';
import ChannelListItem from '@modules/channel/ChannelListItem';
import { LocaleService } from '@modules/locale/locale.service';
import { UtilsService } from '@modules/utils/utils.service';

@Component({
    factory: () => ChannelListItem,
    declarations: [
        LocaleService,
        UtilsService,
    ],
})
export class ChannelListItemComponent {}
