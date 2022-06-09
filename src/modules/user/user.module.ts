import {
    Global,
    Module,
} from 'khamsa';
import { UserSelectorComponent } from '@modules/user/user-selector.component';
import { UserService } from '@modules/user/user.service';
import { UserCardComponent } from '@modules/user/user-card.component';
import { ClientModule } from '@modules/client/client.module';
import { UserSearcherComponent } from '@modules/user/user-searcher.component';

@Global()
@Module({
    imports: [
        ClientModule,
    ],
    providers: [
        UserService,
    ],
    components: [
        UserSelectorComponent,
        UserCardComponent,
        UserSearcherComponent,
    ],
    exports: [
        UserService,
        UserSelectorComponent,
        UserCardComponent,
    ],
})
export class UserModule {}
