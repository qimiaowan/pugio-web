import { Component } from 'khamsa';
import { LocaleService } from '../locale/locale.service';
import ProfileMenu from './ProfileMenu';

@Component({
    component: ProfileMenu,
    declarations: [
        LocaleService,
    ],
})
export class ProfileMenuComponent {}
