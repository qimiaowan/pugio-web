import {
    Global,
    Module,
} from 'khamsa';
import { PopoverComponent } from '@modules/common/popover.component';

@Global()
@Module({
    components: [
        PopoverComponent,
    ],
    exports: [
        PopoverComponent,
    ],
})
export class CommonModule {}
