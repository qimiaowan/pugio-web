import { Module } from 'khamsa';
import { ProfileMenuComponent } from './profile-menu.component';

@Module({
    components: [
        ProfileMenuComponent,
    ],
    exports: [
        ProfileMenuComponent,
    ],
})
export class ProfileModule {}
