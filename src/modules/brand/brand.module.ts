import {
    Global,
    Module,
} from 'khamsa';
import { BrandService } from '@modules/brand/brand.service';

@Global()
@Module({
    providers: [
        BrandService,
    ],
    exports: [
        BrandService,
    ],
})
export class BrandModule {}
