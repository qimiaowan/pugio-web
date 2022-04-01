import {
    Global,
    Module,
} from 'khamsa';
import { LocaleMenuComponent } from './locale-menu.component';
import { LocaleService } from './locale.service';

@Global()
@Module({
    components: [
        LocaleMenuComponent,
    ],
    providers: [
        LocaleService,
    ],
    exports: [
        LocaleService,
        LocaleMenuComponent,
    ],
})
export class LocaleModule {}
