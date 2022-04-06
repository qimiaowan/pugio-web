import { lazy } from 'react';
import { Component } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import { BrandService } from '@modules/brand/brand.service';
import { LocaleMenuComponent } from '@modules/locale/locale-menu.component';
import { ProfileMenuComponent } from '@modules/profile/profile-menu.component';
import { ClientsDropdownComponent } from '@modules/clients/clients-dropdown.component';

@Component({
    component: lazy(() => import('./App')),
    declarations: [
        LocaleService,
        BrandService,
        LocaleMenuComponent,
        ProfileMenuComponent,
        ClientsDropdownComponent,
    ],
})
export class AppComponent {}
