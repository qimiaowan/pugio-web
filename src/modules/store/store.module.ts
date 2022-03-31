import {
    Global,
    Module,
} from 'khamsa';
import { StoreService } from './store.service';

@Global()
@Module({
    providers: [
        StoreService,
    ],
    exports: [
        StoreService,
    ],
})
export class StoreModule {}
