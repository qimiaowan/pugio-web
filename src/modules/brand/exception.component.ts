import { Component } from 'khamsa';
import Exception from '@modules/brand/Exception';
import { BrandService } from '@modules/brand/brand.service';

@Component({
    component: Exception,
    declarations: [
        BrandService,
    ],
})
export class ExceptionComponent {}
