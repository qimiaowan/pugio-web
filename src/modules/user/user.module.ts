import {
    Global,
    Module,
} from 'khamsa';
import { UserSelectorComponent } from '@modules/user/user-selector.component';
import { UserService } from '@modules/user/user.service';

@Global()
@Module({
    components: [
        UserService,
        UserSelectorComponent,
    ],
    exports: [
        UserService,
        UserSelectorComponent,
    ],
})
export class UserModule {}
