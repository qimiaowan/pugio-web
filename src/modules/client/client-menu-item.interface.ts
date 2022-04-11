import { ReactNode } from 'react';

export interface ClientMenuItemProps {
    title: string;
    icon: ReactNode;
    active?: boolean;
    fullWidth?: boolean;
}
