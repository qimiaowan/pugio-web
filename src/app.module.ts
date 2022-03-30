import { Module } from 'khamsa';
import { AppComponent } from './app.component';

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
