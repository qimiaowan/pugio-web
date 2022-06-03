import { Component } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import Tab from '@modules/tab/Tab';
import { LoadingComponent } from '@modules/brand/loading.component';

@Component({
    factory: () => Tab,
    declarations: [
        LocaleService,
        LoadingComponent,
    ],
})
export class TabComponent {}
