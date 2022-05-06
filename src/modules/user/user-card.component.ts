import { Component } from 'khamsa';
import UserCard from '@modules/user/UserCard';
import { LocaleService } from '@modules/locale/locale.service';
import { UtilsService } from '@modules/utils/utils.service';

@Component({
    component: UserCard,
    declarations: [
        LocaleService,
        UtilsService,
    ],
})
export class UserCardComponent {}
