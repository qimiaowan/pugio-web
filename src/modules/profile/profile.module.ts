import { Module } from 'khamsa';
import { ProfileMenuComponent } from '@modules/profile/profile-menu.component';
import { ProfileService } from '@modules/profile/profile.service';

@Module({
    providers: [
        ProfileService,
    ],
    components: [
        ProfileMenuComponent,
    ],
    exports: [
        ProfileMenuComponent,
        ProfileService,
    ],
})
export class ProfileModule {}
