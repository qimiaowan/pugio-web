import {
    Global,
    Module,
} from 'khamsa';
import { PopoverComponent } from '@modules/common/popover.component';
import { FormItemComponent } from '@modules/common/form-item.component';
import { ContextMenuComponent } from '@modules/common/context-menu.component';
import { ModalComponent } from '@modules/common/modal.component';

@Global()
@Module({
    components: [
        PopoverComponent,
        FormItemComponent,
        ContextMenuComponent,
        ModalComponent,
    ],
    exports: [
        PopoverComponent,
        FormItemComponent,
        ContextMenuComponent,
        ModalComponent,
    ],
})
export class CommonModule {}
