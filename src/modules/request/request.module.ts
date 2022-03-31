import {
    Global,
    Module,
} from 'khamsa';
import { RequestService } from './request.service';

@Global()
@Module({
    providers: [
        RequestService,
    ],
    exports: [
        RequestService,
    ],
})
export class RequestModule {}
