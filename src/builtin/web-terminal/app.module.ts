import { Module } from 'khamsa';
import { AppComponent } from '@builtin:web-terminal/app.component';
import { RequestModule } from '@modules/request/request.module';
import { AppService } from '@builtin:web-terminal/app.service';

// const ProfileModule = import('@modules/profile/profile.module').then(({ ProfileModule }) => ProfileModule);

@Module({
    imports: [
        RequestModule,
        // ProfileModule,
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
