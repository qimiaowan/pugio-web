import { FC } from 'react';
import { PopoverTriggerProps } from '@modules/common/popover.interface';
import { Profile } from '@modules/profile/profile.interface';
import { BoxProps } from '@mui/material/Box';

type UserSearcherMode = 'single' | 'multiple';

export interface UserSearcherProps extends BoxProps {
    Trigger: FC<PopoverTriggerProps>;
    selectedUsers?: Profile[];
    mode?: UserSearcherMode;
    onUsersSelected?: (users: Profile[], closePopover: Function) => void;
}
