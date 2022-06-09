import {
    Global,
    Module,
} from 'khamsa';
import { PopoverComponent } from '@modules/common/popover.component';
import { FormItemComponent } from '@modules/common/form-item.component';
import { ContextMenuComponent } from '@modules/common/context-menu.component';

@Global()
@Module({
    components: [
        PopoverComponent,
        FormItemComponent,
        ContextMenuComponent,
    ],
    exports: [
        PopoverComponent,
        FormItemComponent,
        ContextMenuComponent,
    ],
})
export class CommonModule {}
