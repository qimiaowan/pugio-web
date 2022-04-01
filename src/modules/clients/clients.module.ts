import { Module } from 'khamsa';
import { ClientsDropdownComponent } from './clients-dropdown.component';

@Module({
    components: [
        ClientsDropdownComponent,
    ],
    exports: [
        ClientsDropdownComponent,
    ],
})
export class ClientsModule {}
