import { Component } from 'khamsa';
import UserCard from '@modules/user/UserCard';
import { UtilsService } from '@modules/utils/utils.service';

@Component({
    factory: () => UserCard,
    declarations: [
        UtilsService,
    ],
})
export class UserCardComponent {}
