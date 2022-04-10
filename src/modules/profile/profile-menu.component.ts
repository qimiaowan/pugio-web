import { Component } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import { ProfileService } from '@modules/profile/profile.service';
import ProfileMenu from '@modules/profile/ProfileMenu';
import { LoadingComponent } from '@modules/brand/loading.component';

@Component({
    component: ProfileMenu,
    declarations: [
        LocaleService,
        ProfileService,
        LoadingComponent,
    ],
})
export class ProfileMenuComponent {}
