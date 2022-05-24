import { QueryClientMembersRequestOptions } from '@modules/client/client.interface';

export interface ClientMemberTab {
    title: string;
    query?: Partial<Omit<QueryClientMembersRequestOptions, 'role'> & { role: string }>;
}
