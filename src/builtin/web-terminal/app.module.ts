import { Module } from 'khamsa';
import { AppComponent } from '@builtin:web-terminal/app.component';
import { RequestModule } from '@modules/request/request.module';
import { AppService } from '@builtin:web-terminal/app.service';

@Module({
    imports: [
        RequestModule,
    ],
    providers: [
        AppService,
    ],
    components: [
        AppComponent,
    ],
    exports: [
        AppComponent,
        AppService,
    ],
})
export class AppModule {}
