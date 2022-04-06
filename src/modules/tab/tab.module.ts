import { Module } from 'khamsa';
import { TabComponent } from './tab.component';

@Module({
    components: [
        TabComponent,
    ],
    exports: [
        TabComponent,
    ],
})
export class TabModule {}
