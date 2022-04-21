import { Component } from 'khamsa';
import { lazy } from 'react';
import { AppService } from '@builtin:web-terminal/app.service';

@Component({
    component: lazy(() => import('@builtin:web-terminal/App')),
    declarations: [
        AppService,
    ],
})
export class AppComponent {}
