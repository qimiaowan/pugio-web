import { Module } from 'khamsa';
import { AppComponent } from './app.component';
import { LocaleModule } from './modules/locale/locale.module';
import { BrandModule } from './modules/brand/brand.module';
import { StoreModule } from './modules/store/store.module';

@Module({
    imports: [
        LocaleModule,
        StoreModule,
        BrandModule,
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
