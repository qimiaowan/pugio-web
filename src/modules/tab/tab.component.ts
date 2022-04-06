import { Component } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import Tab from './Tab';

@Component({
    component: Tab,
    declarations: [
        LocaleService,
    ],
})
export class TabComponent {}
