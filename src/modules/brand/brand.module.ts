import {
    Global,
    Module,
} from 'khamsa';
import { BrandService } from './brand.service';

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
