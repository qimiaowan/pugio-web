import {
    Module,
} from 'khamsa';
import { StoreService } from '@modules/store/store.service';

@Module({
    providers: [
        StoreService,
    ],
    exports: [
        StoreService,
    ],
})
export class StoreModule {}
