import {
    Global,
    Module,
} from 'khamsa';
import { ConfigService } from '@modules/config/config.service';

@Global()
@Module({
    providers: [
        ConfigService,
    ],
    exports: [
        ConfigService,
    ],
})
export class ConfigModule {}
