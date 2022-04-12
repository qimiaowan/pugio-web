import {
    Global,
    Module,
} from 'khamsa';
import { BrandService } from '@modules/brand/brand.service';
import { LoadingComponent } from '@modules/brand/loading.component';
import { ExceptionComponent } from '@modules/brand/exception.component';

@Global()
@Module({
    providers: [
        BrandService,
    ],
    components: [
        LoadingComponent,
        ExceptionComponent,
    ],
    exports: [
        BrandService,
        LoadingComponent,
        ExceptionComponent,
    ],
})
export class BrandModule {}
