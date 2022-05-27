import {
    Global,
    Module,
} from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';

@Global()
@Module({
    providers: [
        LocaleService,
    ],
    exports: [
        LocaleService,
    ],
})
export class LocaleModule {}
