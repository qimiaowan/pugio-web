import { Module } from 'khamsa';
import { TabComponent } from '@modules/tab/tab.component';

@Module({
    components: [
        TabComponent,
    ],
    exports: [
        TabComponent,
    ],
})
export class TabModule {}
