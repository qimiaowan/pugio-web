import { Component } from 'khamsa';
import UserSearcher from '@modules/user/UserSearcher';
import { PopoverComponent } from '@modules/common/popover.component';
import { UtilsService } from '@modules/utils/utils.service';
import { LocaleService } from '@modules/locale/locale.service';
import { UserService } from '@modules/user/user.service';
import { LoadingComponent } from '@modules/brand/loading.component';

@Component({
    factory: () => UserSearcher,
    declarations: [
        PopoverComponent,
        UtilsService,
        LocaleService,
        UserService,
        LoadingComponent,
    ],
})
export class UserSearcherComponent {}
