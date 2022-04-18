import { Component } from 'khamsa';
import { lazy } from 'react';

@Component({
    component: lazy(() => import('@builtin:web-terminal/App')),
})
export class AppComponent {}
