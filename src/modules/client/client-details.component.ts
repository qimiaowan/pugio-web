import { lazy } from 'react';
import { Component } from 'khamsa';
import { ClientService } from '@modules/client/client.service';
import { LoadingComponent } from '@modules/brand/loading.component';
import { FormItemComponent } from '@modules/common/form-item.component';
import { LocaleService } from '@modules/locale/locale.service';
import { UserSearcherComponent } from '@modules/user/user-searcher.component';

@Component({
    factory: (forwardRef) => lazy(() => forwardRef(import('@modules/client/ClientDetails'))),
    declarations: [
        ClientService,
        LoadingComponent,
        FormItemComponent,
        LocaleService,
        UserSearcherComponent,
    ],
})
export class ClientDetailsComponent {}
