import { Module } from 'khamsa';
import { ProfileMenuComponent } from '@modules/profile/profile-menu.component';
import { ProfileService } from '@modules/profile/profile.service';
import { StoreModule } from '@modules/store/store.module';

@Module({
    imports: [
        StoreModule,
    ],
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
