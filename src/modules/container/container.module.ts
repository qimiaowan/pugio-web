import { Module } from 'khamsa';
import { ContainerComponent } from '@modules/container/container.component';
import { ListenerComponent } from '@modules/container/listener.component';

const LocaleModule = import('@modules/locale/locale.module').then(({ LocaleModule }) => LocaleModule);
const BrandModule = import('@modules/brand/brand.module').then(({ BrandModule }) => BrandModule);
const StoreModule = import('@modules/store/store.module').then(({ StoreModule }) => StoreModule);
const ProfileModule = import('@modules/profile/profile.module').then(({ ProfileModule }) => ProfileModule);
const ClientsModule = import('@modules/clients/clients.module').then(({ ClientsModule }) => ClientsModule);

@Module({
    imports: [
        BrandModule,
        LocaleModule,
        StoreModule,
        ProfileModule,
        ClientsModule,
    ],
    components: [
        ContainerComponent,
        ListenerComponent,
    ],
    exports: [
        ContainerComponent,
        ListenerComponent,
    ],
})
export class ContainerModule {}
