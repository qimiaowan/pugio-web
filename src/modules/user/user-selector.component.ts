import { Component } from 'khamsa';
import { lazy } from 'react';

@Component({
    component: lazy(() => import('@modules/user/UserSelector')),
})
export class UserSelectorComponent {}
