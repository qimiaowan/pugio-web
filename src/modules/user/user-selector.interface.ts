import { DialogProps } from '@mui/material/Dialog';
import { ClientMembership } from '@modules/client/client.interface';

export interface UserSelectorProps extends DialogProps {
    onSelectUsers?: (memberships: ClientMembership[]) => void;
}
