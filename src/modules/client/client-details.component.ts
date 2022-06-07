import { lazy } from 'react';
import { Component } from 'khamsa';

@Component({
    factory: (forwardRef) => lazy(() => forwardRef(import('@modules/client/ClientDetails'))),
})
export class ClientDetailsComponent {}
