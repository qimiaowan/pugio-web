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
}

export interface QueryClientsResponseData {
    id: string;
    roleType: number;
    client: Client;
    createdAt: string;
    updatedAt: string;
}
