import { Component } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import Tab from '@modules/tab/Tab';
import { LoadingComponent } from '@modules/brand/loading.component';
import { BrandService } from '@modules/brand/brand.service';

@Component({
    factory: () => Tab,
    declarations: [
        LocaleService,
        LoadingComponent,
        BrandService,
    ],
})
export class TabComponent {}
