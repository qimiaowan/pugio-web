import { Module } from 'khamsa';
import { AppComponent } from '@builtin:web-terminal/app.component';
import { ContextModule } from '@builtin:web-terminal/modules/context/context.module';

@Module({
    imports: [
        ContextModule,
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
