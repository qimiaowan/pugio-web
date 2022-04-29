import { Module } from 'khamsa';
import { AppComponent } from '@/app.component';
import { RequestModule } from '@modules/request/request.module';
import { UtilsModule } from '@modules/utils/utils.module';

const LocaleModule = import('@modules/locale/locale.module').then(({ LocaleModule }) => LocaleModule);
const BrandModule = import('@modules/brand/brand.module').then(({ BrandModule }) => BrandModule);
const StoreModule = import('@modules/store/store.module').then(({ StoreModule }) => StoreModule);
const ProfileModule = import('@modules/profile/profile.module').then(({ ProfileModule }) => ProfileModule);
const ClientModule = import('@modules/client/client.module').then(({ ClientModule }) => ClientModule);
const ClientsModule = import('@modules/clients/clients.module').then(({ ClientsModule }) => ClientsModule);
const TabModule = import('@modules/tab/tab.module').then(({ TabModule }) => TabModule);
const ContainerModule = import('@modules/container/container.module').then(({ ContainerModule }) => ContainerModule);
const ChannelModule = import('@modules/channel/channel.module').then(({ ChannelModule }) => ChannelModule);
const UserModule = import('@modules/user/user.module').then(({ UserModule }) => UserModule);

@Module({
    imports: [
        UtilsModule,
        RequestModule,
        BrandModule,
        LocaleModule,
        StoreModule,
        ProfileModule,
        ClientModule,
        ClientsModule,
        TabModule,
        ContainerModule,
        ChannelModule,
        UserModule,
    ],
    components: [
        AppComponent,
    ],
    routes: [
        {
            path: '/',
            useComponentClass: AppComponent,
            children: [
                {
                    path: 'client',
                    useModuleClass: ClientModule,
                },
            ],
        },
    ],
})
export class AppModule {}
