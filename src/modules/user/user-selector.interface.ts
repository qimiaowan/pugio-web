import { DialogProps } from '@mui/material/Dialog';
import { Profile } from '@modules/profile/profile.interface';

export interface UserSelectorProps extends DialogProps {
    onSelectUsers?: (users: Profile[]) => void;
}
