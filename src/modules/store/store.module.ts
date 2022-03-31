import {
    Module,
} from 'khamsa';
import { StoreService } from './store.service';

@Module({
    providers: [
        StoreService,
    ],
    exports: [
        StoreService,
    ],
})
export class StoreModule {}
