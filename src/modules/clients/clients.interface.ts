import { TDateRange } from '@/app.interfaces';

export interface Client {
    id: string;
    name: string;
    description: string;
    verified: boolean;
    updatedAt: string;
    createdAt: string;
}

export interface QueryClientsRequestOptions {
    search?: string;
    lastCursor?: string;
    size?: number;
    roles?: string[];
    createDateRange?: TDateRange;
}

export interface QueryClientsResponseData {
    id: string;
    roleType: number;
    client: Client;
    createdAt: string;
    updatedAt: string;
}
