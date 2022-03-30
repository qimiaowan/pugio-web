import { Module } from 'khamsa';
import { AppComponent } from './app.component';

const LocaleModule = import('./modules/locale/locale.module').then(({ LocaleModule }) => LocaleModule);

@Module({
    imports: [
        LocaleModule,
    ],
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
