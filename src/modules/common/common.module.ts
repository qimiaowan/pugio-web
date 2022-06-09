import {
    Global,
    Module,
} from 'khamsa';
import { PopoverComponent } from '@modules/common/popover.component';
import { FormItemComponent } from '@modules/common/form-item.component';

@Global()
@Module({
    components: [
        PopoverComponent,
        FormItemComponent,
    ],
    exports: [
        PopoverComponent,
        FormItemComponent,
    ],
})
export class CommonModule {}
