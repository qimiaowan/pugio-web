import { Component } from 'khamsa';
import { lazy } from 'react';
import { LocaleService } from '@modules/locale/locale.service';
import { UtilsService } from '@modules/utils/utils.service';
import { UserService } from '@modules/user/user.service';

@Component({
    component: lazy(() => import('@modules/user/UserSelector')),
    declarations: [
        UtilsService,
        LocaleService,
        UserService,
    ],
})
export class UserSelectorComponent {}
