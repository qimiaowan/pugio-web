import { Module } from 'khamsa';
import { AppComponent } from '@builtin:web-terminal/app.component';

@Module({
    components: [
        AppComponent,
    ],
    exports: [
        AppComponent,
    ],
})
export class AppModule {}
