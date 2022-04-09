import {
    Global,
    Module,
} from 'khamsa';
import { BrandService } from '@modules/brand/brand.service';
import { LoadingComponent } from '@/modules/brand/loading.component';

@Global()
@Module({
    providers: [
        BrandService,
    ],
    components: [
        LoadingComponent,
    ],
    exports: [
        BrandService,
        LoadingComponent,
    ],
})
export class BrandModule {}
