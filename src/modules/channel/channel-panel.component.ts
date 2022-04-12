import { Component } from 'khamsa';
import ChannelPanel from '@modules/channel/ChannelPanel';
import { UtilsService } from '@modules/utils/utils.service';
import { LoadingComponent } from '@modules/brand/loading.component';
import { ExceptionComponent } from '@modules/brand/exception.component';
import { LocaleService } from '@modules/locale/locale.service';

@Component({
    component: ChannelPanel,
    declarations: [
        UtilsService,
        LoadingComponent,
        ExceptionComponent,
        LocaleService,
    ],
})
export class ChannelPanelComponent {}
