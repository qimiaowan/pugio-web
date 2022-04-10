import {
    Global,
    Module,
} from 'khamsa';
import { BrandService } from '@modules/brand/brand.service';
import { LoadingComponent } from '@/modules/brand/loading.component';
import { EmptyComponent } from '@/modules/brand/empty.component';

@Global()
@Module({
    providers: [
        BrandService,
    ],
    components: [
        LoadingComponent,
        EmptyComponent,
    ],
    exports: [
        BrandService,
        LoadingComponent,
        EmptyComponent,
    ],
})
export class BrandModule {}
