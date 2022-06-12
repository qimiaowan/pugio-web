import {
    FC,
    useEffect,
    useState,
} from 'react';
import { UserSelectorProps } from '@modules/user/user-selector.interface';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import { getContainer } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import SimpleBar from 'simplebar-react';
import clsx from 'clsx';
import _ from 'lodash';
import { UserCardProps } from '@modules/user/user-card.interface';
import { UserCardComponent } from '@modules/user/user-card.component';
import { Profile } from '@modules/profile/profile.interface';
import { ExceptionComponentProps } from '@modules/brand/exception.interface';
import { ExceptionComponent } from '@modules/brand/exception.component';
import styled from '@mui/material/styles/styled';
import useTheme from '@mui/material/styles/useTheme';
import { ClientRoleSelectorProps } from '@modules/client/client-role-selector.interface';
import { ClientRoleSelectorComponent } from '@modules/client/client-role-selector.component';
import { ClientMembership } from '@modules/client/client.interface';
import { UserSearcherProps } from '@modules/user/user-searcher.interface';
import { UserSearcherComponent } from '@modules/user/user-searcher.component';
import { ModalProps } from '@modules/common/modal.interface';
import { ModalComponent } from '@modules/common/modal.component';

const UserSelectorWrapper = styled(Dialog)(({ theme }) => {
    return `
        .dialog-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: transparent;
            padding-left: ${theme.spacing(1)};
            padding-right: ${theme.spacing(1)};
            border-bottom: 1px solid ${theme.palette.divider};

            .search {
                flex-grow: 1;
                margin: 0 ${theme.spacing(1)};
            }
        }

        .content {
            max-height: 720px;
            min-height: 320px;
            padding: 0;
            border-top: 0;
            padding-top: 0 !important;

            .select-controls-wrapper {
                padding: ${theme.spacing(1)};
            }
        }

        .simplebar-content {
            display: flex;
            flex-direction: column;
            align-items: stretch;
        }
    `;
});

const UserSelector: FC<UserSelectorProps> = ({
    onSelectUsers = _.noop,
    ...props
}) => {
    const {
        muiDialogProps = {},
    } = props;
    const container = getContainer(UserSelector);
    const localeService = container.get<LocaleService>(LocaleService);
    const UserCard = container.get<FC<UserCardProps>>(UserCardComponent);
    const Exception = container.get<FC<ExceptionComponentProps>>(ExceptionComponent);
    const ClientRoleSelector = container.get<FC<ClientRoleSelectorProps>>(ClientRoleSelectorComponent);
    const UserSearcher = container.get<FC<UserSearcherProps>>(UserSearcherComponent);
    const Modal = container.get<FC<ModalProps>>(ModalComponent);

    const theme = useTheme();
    const [selectedMembershipList, setSelectedMembershipList] = useState<(Omit<ClientMembership, 'userId'> & { profile: Profile })[]>([]);
    const [selectedSelectedUserIdList, setSelectedSelectedUserIdList] = useState<string[]>([]);
    const [dialogContentHeight, setDialogContentHeight] = useState<number>(0);
    const [dialogContentElement, setDialogContentElement] = useState<HTMLDivElement>(null);
    const getComponentLocaleText = localeService.useLocaleContext('components.userSelector');

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            const [observationData] = entries;

            if (observationData) {
                const blockSize = _.get(observationData, 'borderBoxSize[0].blockSize');

                if (_.isNumber(blockSize)) {
                    setDialogContentHeight(blockSize);
                }
            }
        });

        if (dialogContentElement) {
            observer.observe(dialogContentElement);
        }

        return () => {
            observer.disconnect();
        };
    }, [dialogContentElement]);

    return (
        <Modal
            {...props}
            DialogComponent={UserSelectorWrapper}
            muiDialogProps={{
                ...muiDialogProps,
                disableEscapeKeyDown: true,
                maxWidth: 'sm',
                fullWidth: true,
                className: clsx('user-selector', muiDialogProps.className),
            }}
        >
            {
                ({ closeModal }) => {
                    const handleCloseSelector = (event = {}, reason = null) => {
                        if (reason === 'backdropClick' || reason !== null) {
                            return;
                        }

                        closeModal();
                        setSelectedMembershipList([]);
                        setSelectedSelectedUserIdList([]);
                    };

                    return (
                        <>
                            <DialogTitle classes={{ root: 'dialog-title' }}>
                                <UserSearcher
                                    Trigger={({ openPopover }) => {
                                        return (
                                            <Button
                                                color="primary"
                                                startIcon={<Icon className="icon icon-account-add" />}
                                                onClick={openPopover}
                                            >{getComponentLocaleText('addUsers')}</Button>
                                        );
                                    }}
                                    selectedUsers={selectedMembershipList.map((membership) => membership.profile)}
                                    onUsersSelected={(users) => setSelectedMembershipList(users.map((user) => {
                                        return {
                                            profile: user,
                                            roleType: 2,
                                        };
                                    }))}
                                />
                                <IconButton onClick={() => handleCloseSelector()}><Icon className="icon-x" /></IconButton>
                            </DialogTitle>
                            <DialogContent
                                classes={{ root: 'content' }}
                                ref={(ref) => setDialogContentElement(ref as unknown as HTMLDivElement)}
                            >
                                {
                                    selectedMembershipList.length === 0
                                        ? <Exception
                                            type="empty"
                                            title={getComponentLocaleText('noSelected.title')}
                                            subTitle={getComponentLocaleText('noSelected.subTitle')}
                                        />
                                        : <Box>
                                            <Box className="select-controls-wrapper">
                                                <Button
                                                    size="small"
                                                    color={selectedMembershipList.length === selectedSelectedUserIdList.length ? 'info' : 'secondary'}
                                                    startIcon={<Icon className="icon-check-square" />}
                                                    sx={{
                                                        marginRight: theme.spacing(1),
                                                    }}
                                                    onClick={() => {
                                                        if (selectedMembershipList.length === selectedSelectedUserIdList.length) {
                                                            setSelectedSelectedUserIdList([]);
                                                        } else {
                                                            setSelectedSelectedUserIdList(
                                                                _.uniq(selectedSelectedUserIdList.concat(
                                                                    selectedMembershipList.map((membership) => membership.profile.id),
                                                                )),
                                                            );
                                                        }
                                                    }}
                                                >
                                                    {
                                                        selectedMembershipList.length === selectedSelectedUserIdList.length
                                                            ? getComponentLocaleText('unselectAll')
                                                            : getComponentLocaleText('selectAll')
                                                    }
                                                </Button>
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    variant="text"
                                                    startIcon={<Icon className="icon-trash-2" />}
                                                    disabled={selectedSelectedUserIdList.length === 0}
                                                    onClick={() => {
                                                        setSelectedMembershipList(selectedMembershipList.filter((membership) => {
                                                            return !selectedSelectedUserIdList.some((userId) => userId === membership.profile.id);
                                                        }));
                                                        setSelectedSelectedUserIdList([]);
                                                    }}
                                                >{getComponentLocaleText('delete')}{selectedSelectedUserIdList.length > 0 ? ` (${selectedSelectedUserIdList.length})` : ''}</Button>
                                            </Box>
                                            <SimpleBar style={{ maxHeight: dialogContentHeight - 1 || 720 }}>
                                                {
                                                    selectedMembershipList.map((membership) => {
                                                        return (
                                                            <UserCard
                                                                key={membership.profile.id}
                                                                profile={membership.profile}
                                                                autoHide={false}
                                                                checked={selectedSelectedUserIdList.indexOf(membership.profile.id) !== -1}
                                                                menu={[
                                                                    {
                                                                        icon: 'icon-delete',
                                                                        title: getComponentLocaleText('clearSelected'),
                                                                        onActive: () => {
                                                                            setSelectedMembershipList(selectedMembershipList.filter((selectedMembership) => {
                                                                                return membership.profile.id !== selectedMembership.profile.id;
                                                                            }));
                                                                        },
                                                                    },
                                                                ]}
                                                                controlSlot={
                                                                    <ClientRoleSelector
                                                                        role={membership.roleType}
                                                                        onRoleChange={(role) => {
                                                                            setSelectedMembershipList(
                                                                                selectedMembershipList.map((selectedMembership) => {
                                                                                    if (membership.profile.id !== selectedMembership.profile.id) {
                                                                                        return selectedMembership;
                                                                                    }
                                                                                    return _.set(selectedMembership, 'roleType', role);
                                                                                }),
                                                                            );
                                                                        }}
                                                                    />
                                                                }
                                                                onCheckStatusChange={(checked) => {
                                                                    if (checked) {
                                                                        setSelectedSelectedUserIdList(
                                                                            _.uniq(selectedSelectedUserIdList.concat(membership.profile.id)),
                                                                        );
                                                                    } else {
                                                                        setSelectedSelectedUserIdList(
                                                                            selectedSelectedUserIdList.filter((userId) => {
                                                                                return userId !== membership.profile.id;
                                                                            }),
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                        );
                                                    })
                                                }
                                            </SimpleBar>
                                        </Box>
                                }
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => handleCloseSelector()}>{getComponentLocaleText('cancel')}</Button>
                                <Button
                                    color="primary"
                                    disabled={selectedMembershipList.length === 0}
                                    onClick={() => {
                                        onSelectUsers(selectedMembershipList.map((membership) => {
                                            return {
                                                userId: membership.profile.id,
                                                roleType: membership.roleType,
                                            };
                                        }));
                                        handleCloseSelector();
                                    }}
                                >{getComponentLocaleText('ok')}</Button>
                            </DialogActions>
                        </>
                    );
                }
            }
        </Modal>
    );
};

export default UserSelector;
