import {
    Global,
    Module,
} from 'khamsa';
import { UserSelectorComponent } from '@modules/user/user-selector.component';
import { UserService } from '@modules/user/user.service';
import { UserCardComponent } from '@modules/user/user-card.component';

@Global()
@Module({
    providers: [
        UserService,
    ],
    components: [
        UserSelectorComponent,
        UserCardComponent,
    ],
    exports: [
        UserService,
        UserSelectorComponent,
        UserCardComponent,
    ],
})
export class UserModule {}
