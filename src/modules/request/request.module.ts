import {
    Global,
    Module,
} from 'khamsa';
import { RequestService } from '@modules/request/request.service';

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
