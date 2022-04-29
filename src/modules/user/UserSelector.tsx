import { FC } from 'react';
import { UserSelectorProps } from '@modules/user/user-selector.interface';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

const UserSelector: FC<UserSelectorProps> = ({
    onSelectUsers,
    ...props
}) => {
    return (
        <Dialog {...props}>
            <DialogTitle classes={{ root: 'title' }}>
            </DialogTitle>
            <DialogContent></DialogContent>
            <DialogActions></DialogActions>
        </Dialog>
    );
};

export default UserSelector;
