import { lazy } from 'react';
import { Component } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import { ContainerComponent } from '@modules/container/container.component';
import { ListenerComponent } from '@modules/container/listener.component';

@Component({
    // component: lazy(() => import('@/App')),
    factory: (forwardRef) => {
        return lazy(() => forwardRef(import('@/App')));
    },
    declarations: [
        LocaleService,
        ContainerComponent,
        ListenerComponent,
    ],
})
export class AppComponent {}
