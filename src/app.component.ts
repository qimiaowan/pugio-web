import { lazy } from 'react';
import { Component } from 'khamsa';
import { LocaleService } from './modules/locale/locale.service';

@Component({
    component: lazy(() => import('./App')),
    declarations: [
        LocaleService,
    ],
})
export class AppComponent {}
