import { lazy } from 'react';
import { Component } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import { BrandService } from '@modules/brand/brand.service';
import { ProfileMenuComponent } from '@modules/profile/profile-menu.component';
import { ClientsDropdownComponent } from '@modules/clients/clients-dropdown.component';
import { StoreService } from '@modules/store/store.service';
import { PopoverComponent } from '@modules/common/popover.component';

@Component({
    factory: (forwardRef) => {
        return lazy(() => {
            return forwardRef(import('@modules/container/Container'));
        });
    },
    declarations: [
        LocaleService,
        BrandService,
        ProfileMenuComponent,
        ClientsDropdownComponent,
        StoreService,
        PopoverComponent,
    ],
})
export class ContainerComponent {}
