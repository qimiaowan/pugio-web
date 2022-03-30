import {
    Global,
    Module,
} from 'khamsa';
import { LocaleService } from './locale.service';

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
