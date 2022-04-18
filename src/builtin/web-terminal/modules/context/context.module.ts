import { Module } from 'khamsa';
import { ContextService } from '@builtin:web-terminal/modules/context/context.service';

@Module({
    providers: [
        ContextService,
    ],
    exports: [
        ContextService,
    ],
})
export class ContextModule {}
