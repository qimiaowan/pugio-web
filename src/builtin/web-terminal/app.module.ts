import { Module } from 'khamsa';
import { AppComponent } from '@builtin:web-terminal/app.component';

@Module({
    components: [
        AppComponent,
    ],
    routes: [
        {
            path: '',
            useComponentClass: AppComponent,
        },
    ],
})
export class AppModule {}
