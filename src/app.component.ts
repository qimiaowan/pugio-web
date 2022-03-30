import { lazy } from 'react';
import { Component } from 'khamsa';

@Component({
    component: lazy(() => import('./App')),
})
export class AppComponent {}
