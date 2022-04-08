import { Component } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import { ProfileService } from '@modules/profile/profile.service';
import ProfileMenu from '@modules/profile/ProfileMenu';

@Component({
    component: ProfileMenu,
    declarations: [
        LocaleService,
        ProfileService,
    ],
})
export class ProfileMenuComponent {}
