import { Component } from 'khamsa';
import App from '@builtin:web-terminal/App';
import { ContextService } from '@builtin:web-terminal/modules/context/context.service';

@Component({
    component: App,
    declarations: [
        ContextService,
    ],
})
export class AppComponent {}
