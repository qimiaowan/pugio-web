import {
    Module,
} from 'khamsa';
import { StoreService } from '@modules/store/store.service';
import {
    AppModule as WebTerminalAppModule,
} from '@builtin:web-terminal/app.module';

@Module({
    imports: [
        WebTerminalAppModule,
    ],
    providers: [
        StoreService,
    ],
    exports: [
        StoreService,
    ],
})
export class StoreModule {}
