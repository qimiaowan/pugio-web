import { Component } from 'khamsa';
import Exception from '@modules/brand/Exception';
import { BrandService } from '@modules/brand/brand.service';

@Component({
    factory: () => Exception,
    declarations: [
        BrandService,
    ],
})
export class ExceptionComponent {}
