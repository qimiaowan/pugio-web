import {
    Global,
    Module,
} from 'khamsa';
import { LocaleMenuComponent } from '@modules/locale/locale-menu.component';
import { LocaleService } from '@modules/locale/locale.service';

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
