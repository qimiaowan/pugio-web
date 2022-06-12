import { ClientMembership } from '@modules/client/client.interface';
import { ModalProps } from '@modules/common/modal.interface';

export interface UserSelectorProps extends Omit<ModalProps, 'children'> {
    onSelectUsers?: (memberships: ClientMembership[]) => void;
}
