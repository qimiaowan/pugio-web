import { Component } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import Tab from '@modules/tab/Tab';

@Component({
    component: Tab,
    declarations: [
        LocaleService,
    ],
})
export class TabComponent {}
