import { Component } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import { ProfileService } from '@modules/profile/profile.service';
import ProfileMenu from '@modules/profile/ProfileMenu';
import { LoadingComponent } from '@modules/brand/loading.component';
import { StoreService } from '@modules/store/store.service';

@Component({
    component: ProfileMenu,
    declarations: [
        LocaleService,
        ProfileService,
        LoadingComponent,
        StoreService,
    ],
})
export class ProfileMenuComponent {}
