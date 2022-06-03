import { Component } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import { ProfileService } from '@modules/profile/profile.service';
import ProfileMenu from '@modules/profile/ProfileMenu';
import { LoadingComponent } from '@modules/brand/loading.component';
import { StoreService } from '@modules/store/store.service';
import { ConfigService } from '@modules/config/config.service';
import { PopoverComponent } from '@modules/common/popover.component';

@Component({
    factory: () => ProfileMenu,
    declarations: [
        LocaleService,
        ProfileService,
        LoadingComponent,
        StoreService,
        ConfigService,
        PopoverComponent,
    ],
})
export class ProfileMenuComponent {}
