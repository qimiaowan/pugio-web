import {
    Global,
    Module,
} from 'khamsa';
import { UtilsService } from '@modules/utils/utils.service';

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
