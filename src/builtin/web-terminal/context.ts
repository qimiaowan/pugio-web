import { createContext } from 'react';
import { ChannelConfig } from '@modules/store/store.interface';

export const Context = createContext<ChannelConfig>(null);
