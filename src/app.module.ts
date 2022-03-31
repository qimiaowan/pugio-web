import { Module } from 'khamsa';
import { AppComponent } from './app.component';
import { RequestModule } from './modules/request/request.module';
import { UtilsModule } from './modules/utils/utils.module';

const LocaleModule = import('./modules/locale/locale.module').then(({ LocaleModule }) => LocaleModule);
const BrandModule = import('./modules/brand/brand.module').then(({ BrandModule }) => BrandModule);
const StoreModule = import('./modules/store/store.module').then(({ StoreModule }) => StoreModule);

@Module({
    imports: [
        UtilsModule,
        RequestModule,
        BrandModule,
        LocaleModule,
        StoreModule,
    ],
    components: [
        AppComponent,
    ],
    routes: [
        {
            path: '',
            useComponentClass: AppComponent,
        },
    ],
})
export class AppModule {}
