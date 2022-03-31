import {
    Global,
    Module,
} from 'khamsa';
import { UtilsService } from './utils.service';

@Global()
@Module({
    providers: [
        UtilsService,
    ],
    exports: [
        UtilsService,
    ],
})
export class UtilsModule {}
