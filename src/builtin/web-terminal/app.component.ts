import { Component } from 'khamsa';
import { lazy } from 'react';
import { AppService } from '@builtin:web-terminal/app.service';
import { LocaleService } from '@modules/locale/locale.service';
import { LoadingComponent } from '@modules/brand/loading.component';

@Component({
    component: lazy(() => import('@builtin:web-terminal/App')),
    declarations: [
        AppService,
        LocaleService,
        LoadingComponent,
    ],
})
export class AppComponent {}
