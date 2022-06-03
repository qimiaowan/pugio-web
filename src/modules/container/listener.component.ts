import { Component } from 'khamsa';
import { StoreService } from '@modules/store/store.service';
import { UtilsService } from '@modules/utils/utils.service';
import Listener from './Listener';

@Component({
    factory: () => Listener,
    declarations: [
        UtilsService,
        StoreService,
    ],
})
export class ListenerComponent {}
