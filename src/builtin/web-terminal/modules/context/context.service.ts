import { Injectable } from 'khamsa';
import { createContext } from 'react';
import { ChannelConfig } from '@modules/store/store.interface';

@Injectable()
export class ContextService {
    public readonly Context = createContext<ChannelConfig>(null);
}
