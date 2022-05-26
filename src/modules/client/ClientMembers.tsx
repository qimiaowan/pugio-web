import {
    FC,
    useEffect,
    useState,
    useRef,
} from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import TextField from '@mui/material/TextField';
import clsx from 'clsx';
import { InjectedComponentProps } from 'khamsa';
import { UtilsService } from '@modules/utils/utils.service';
import {
    ClientMembership,
    QueryClientMembersResponseDataItem,
} from '@modules/client/client.interface';
import { ClientService } from '@modules/client/client.service';
import _ from 'lodash';
import {
    useDebounce,
    useRequest,
} from 'ahooks';
import { useParams } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { ClientMemberTab } from '@modules/client/client-members.interface';
import { LocaleService } from '@modules/locale/locale.service';
import { LoadingComponent } from '@modules/brand/loading.component';
import { ExceptionProps } from '@modules/brand/exception.interface';
import { ExceptionComponent } from '@modules/brand/exception.component';
import { UserCardProps } from '@modules/user/user-card.interface';
import { UserCardComponent } from '@modules/user/user-card.component';
import { useSnackbar } from 'notistack';
import { UserSelectorProps } from '@modules/user/user-selector.interface';
import { UserSelectorComponent } from '@modules/user/user-selector.component';
import { StoreService } from '@modules/store/store.service';
import SimpleBar from 'simplebar-react';
import styled from '@mui/material/styles/styled';
import { ConfigService } from '@modules/config/config.service';
import { ClientRoleSelectorProps } from '@modules/client/client-role-selector.interface';
import { ClientRoleSelectorComponent } from '@modules/client/client-role-selector.component';

const ClientMembersWrapper = styled(Box)(({ theme }) => {
    const mode = theme.palette.mode;

    return `
        display: flex;
        flex-direction: column;
        height: 100%;

        * {
            box-sizing: border-box;
        }

        .header {
            width: 100%;
            padding: ${theme.spacing(1)};
            display: flex;
            justify-content: space-between;
            background-color: ${mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50]};

            .header-controls-wrapper {
                display: flex;
                align-items: center;

                & > * {
                    margin-right: ${theme.spacing(1)};

                    &:last-child {
                        margin-right: 0;
                    }
                }

                .search {
                    width: 240px;
                    background-color: white;
                }

                .toggle-button {
                    min-width: 64px;
                }
            }
        }

        .client-members-page {
            display: flex;
            flex-direction: column;
            justify-content: stretch;
            align-items: center;

            .exception {
                height: 100%;
            }

            .members-wrapper {
                width: 100%;
                height: 100%;
                display: flex;
                box-sizing: border-box;

                &.loading-wrapper {
                    justify-content: center;
                    align-items: center;
                }

                .simplebar-content {
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: stretch;
                }
            }

            .load-more-button {
                align-self: center;
                margin-top: ${theme.spacing(1)};
            }
        }
    `;
});

const ClientMembers: FC<InjectedComponentProps<BoxProps>> = ({
    className = '',
    declarations,
    ...props
}) => {
    const clientService = declarations.get<ClientService>(ClientService);
    const utilsService = declarations.get<UtilsService>(UtilsService);
    const localeService = declarations.get<LocaleService>(LocaleService);
    const storeService = declarations.get<StoreService>(StoreService);
    const Loading = declarations.get<FC<BoxProps>>(LoadingComponent);
    const Exception = declarations.get<FC<ExceptionProps>>(ExceptionComponent);
    const UserCard = declarations.get<FC<UserCardProps>>(UserCardComponent);
    const UserSelector = declarations.get<FC<UserSelectorProps>>(UserSelectorComponent);
    const configService = declarations.get<ConfigService>(ConfigService);
    const ClientRoleSelector = declarations.get<FC<ClientRoleSelectorProps>>(ClientRoleSelectorComponent);

    const { client_id: clientId } = useParams();
    const getLocaleText = localeService.useLocaleContext();
    const getPageLocaleText = localeService.useLocaleContext('pages.clientMembers');
    const getComponentLocaleText = localeService.useLocaleContext('components');
    const [searchValue, setSearchValue] = useState<string>('');
    const [role, setRole] = useState<string>(undefined);
    const [tabs, setTabs] = useState<ClientMemberTab[]>([]);
    const [controlsWrapperHeight, setControlsWrapperHeight] = useState<number>(0);
    const [membersContainerHeight, setMembersContainerHeight] = useState<number>(0);
    const [membersContainerWidth, setMembersContainerWidth] = useState<number>(0);
    const controlsWrapperRef = useRef<HTMLDivElement>(null);
    const debouncedSearchValue = useDebounce(searchValue);
    const {
        data: queryClientMembersResponseData,
        loadMore: queryMoreClientMembers,
        loading: queryClientMembersLoading,
        loadingMore: queryClientMembersLoadingMore,
        reload: reloadQueryClientMembers,
    } = utilsService.useLoadMore<QueryClientMembersResponseDataItem> (
        (data) => {
            if (role === undefined) {
                return null;
            }

            return clientService.queryClientMembers({
                clientId,
                role: role === configService.CLIENT_MEMBER_ALL_ROLE_TYPE ? [1, 2] : [parseInt(role, 10)],
                ..._.pick(data, ['lastCursor', 'size']),
                search: debouncedSearchValue,
            });
        },
        {
            reloadDeps: [
                clientId,
                debouncedSearchValue,
            ],
        },
    );
    const {
        data: userClientRelationResponseData,
    } = useRequest(
        () => {
            return clientService.getUserClientRelation({
                clientId,
            });
        },
        {
            refreshDeps: [],
        },
    );
    const [selectedMemberships, setSelectedMemberships] = useState<ClientMembership[]>([]);
    const confirm = utilsService.useConfirm();
    const { enqueueSnackbar } = useSnackbar();
    const [userSelectorOpen, setUserSelectorOpen] = useState<boolean>(false);
    const {
        windowInnerHeight,
        windowInnerWidth,
        appNavbarHeight,
        clientSidebarWidth,
    } = storeService.useStore((state) => {
        const {
            windowInnerHeight,
            windowInnerWidth,
            appNavbarHeight,
            clientSidebarWidth,
        } = state;

        return {
            windowInnerHeight,
            windowInnerWidth,
            appNavbarHeight,
            clientSidebarWidth,
        };
    });
    const [clientMembers, setClientMembers] = useState<QueryClientMembersResponseDataItem[]>([]);

    const handleAddSelectedMemberships = (membership: ClientMembership) => {
        if (selectedMemberships.some((selectedMemberships) => selectedMemberships.userId === membership.userId)) {
            return;
        }

        setSelectedMemberships(selectedMemberships.concat(membership));
    };

    const handleDeleteSelectedMemberships = (memberships: ClientMembership[]) => {
        setSelectedMemberships(
            selectedMemberships.filter((selectedMembership) => {
                return !memberships.some((membership) => membership?.userId === selectedMembership.userId);
            }),
        );
    };

    const handleDeleteSelectedMembers = (memberships: ClientMembership[]) => {
        confirm({
            title: getComponentLocaleText('confirm.confirm'),
            description: getPageLocaleText('deleteConfirm', { count: memberships.length }),
            onConfirm: () => {
                clientService.deleteClientMembers({
                    clientId,
                    users: memberships.map((membership) => membership.userId),
                })
                    .then((response) => {
                        const deletedUsers = response?.response || [];
                        setSelectedMemberships(
                            selectedMemberships.filter((selectedMembership) => {
                                return !deletedUsers.some((deletedMembership) => selectedMembership?.userId === deletedMembership?.user.id);
                            }),
                        );
                        reloadQueryClientMembers();
                    })
                    .catch(() => enqueueSnackbar(getPageLocaleText('exceptions.deleteMembers'), {
                        variant: 'error',
                    }));
            },
        });
    };

    useEffect(() => {
        if (userClientRelationResponseData?.response) {
            const { roleType } = userClientRelationResponseData.response;

            if (roleType === 0) {
                setTabs([
                    {
                        title: 'tabs.all',
                        query: {
                            role: configService.CLIENT_MEMBER_ALL_ROLE_TYPE,
                        },
                    },
                    {
                        title: 'tabs.members',
                        query: {
                            role: '2',
                        },
                    },
                    {
                        title: 'tabs.admins',
                        query: {
                            role: '1',
                        },
                    },
                ]);
                setRole(configService.CLIENT_MEMBER_ALL_ROLE_TYPE);
            }
        }
    }, [userClientRelationResponseData]);

    useEffect(() => {
        if (controlsWrapperRef.current) {
            setControlsWrapperHeight(controlsWrapperRef.current.clientHeight);
        }
    }, [controlsWrapperRef.current]);

    useEffect(() => {
        setMembersContainerHeight(windowInnerHeight - appNavbarHeight * 2 - controlsWrapperHeight + 2);
        setMembersContainerWidth(windowInnerWidth - clientSidebarWidth + 1);
    }, [
        controlsWrapperHeight,
        windowInnerHeight,
        windowInnerWidth,
        appNavbarHeight,
        clientSidebarWidth,
    ]);

    useEffect(() => {
        reloadQueryClientMembers();
    }, [role]);

    useEffect(() => {
        setClientMembers(queryClientMembersResponseData?.list || []);
    }, [queryClientMembersResponseData]);

    return (
        <ClientMembersWrapper
            {...props}
            className={clsx(className)}
        >
            <Box className="header" ref={controlsWrapperRef}>
                <Box className="header-controls-wrapper">
                    {
                        tabs.length > 0 && (
                            <ToggleButtonGroup value={role}>
                                {
                                    tabs.map((tab) => {
                                        const {
                                            title,
                                            query,
                                        } = tab;

                                        return (
                                            <ToggleButton
                                                value={query?.role}
                                                key={title}
                                                classes={{
                                                    root: 'toggle-button',
                                                }}
                                                onClick={() => setRole(query?.role)}
                                            >{getPageLocaleText(title)}</ToggleButton>
                                        );
                                    })
                                }
                            </ToggleButtonGroup>
                        )
                    }
                    <TextField
                        classes={{ root: 'search' }}
                        placeholder={getPageLocaleText('placeholder')}
                        disabled={queryClientMembersLoading || queryClientMembersLoadingMore}
                        onChange={(event) => {
                            setSearchValue(event.target.value);
                        }}
                    />
                </Box>
                <Box className="header-controls-wrapper">
                    {
                        selectedMemberships.length > 0 && (
                            <Button
                                variant="text"
                                size="small"
                                color="error"
                                startIcon={<Icon className="icon-delete" />}
                                title={getPageLocaleText('delete', { count: selectedMemberships.length })}
                                onClick={() => handleDeleteSelectedMembers(selectedMemberships)}
                            >{getPageLocaleText('delete', { count: selectedMemberships.length })}</Button>
                        )
                    }
                    <Button
                        variant="text"
                        size="small"
                        color="primary"
                        startIcon={<Icon className="icon-account-add" />}
                        onClick={() => setUserSelectorOpen(true)}
                    >{getPageLocaleText('add')}</Button>
                </Box>
            </Box>
            <Divider />
            <Box className="page client-members-page">
                <Box
                    className={clsx('members-wrapper', {
                        'loading-wrapper': queryClientMembersLoading,
                    })}
                >
                    {
                        queryClientMembersLoading
                            ? <Loading />
                            : clientMembers.length === 0
                                ? <Exception
                                    imageSrc="/static/images/empty.svg"
                                    title={getPageLocaleText('empty.title')}
                                    subTitle={getPageLocaleText('empty.subTitle')}
                                />
                                : <SimpleBar style={{ width: membersContainerWidth, height: membersContainerHeight }}>
                                    {
                                        clientMembers.map((listItem) => {
                                            const {
                                                id,
                                                user,
                                                roleType,
                                            } = listItem;

                                            const membership: ClientMembership = {
                                                userId: user.id,
                                                roleType,
                                            };

                                            return (
                                                <UserCard
                                                    key={id}
                                                    profile={user}
                                                    menu={[
                                                        {
                                                            icon: 'icon-delete',
                                                            title: getPageLocaleText('userCardMenu.delete'),
                                                            onActive: () => handleDeleteSelectedMembers([membership]),
                                                        },
                                                    ]}
                                                    controlSlot={role === configService.CLIENT_MEMBER_ALL_ROLE_TYPE && <ClientRoleSelector
                                                        role={roleType}
                                                        triggerProps={{
                                                            disabled: userClientRelationResponseData?.response?.roleType >= roleType,
                                                        }}
                                                        onRoleChange={(role) => {
                                                            clientService.changeClientMembership({
                                                                clientId,
                                                                memberships: [
                                                                    {
                                                                        userId: user.id,
                                                                        roleType: role,
                                                                    },
                                                                ],
                                                            });

                                                            const index = clientMembers.findIndex((membership) => {
                                                                return membership.user.id === user.id;
                                                            });

                                                            if (index !== -1) {
                                                                setClientMembers(
                                                                    clientMembers.splice(
                                                                        index,
                                                                        1,
                                                                        _.set(clientMembers[index], 'roleType', role),
                                                                    ),
                                                                );
                                                            }
                                                        }}
                                                    />}
                                                    checked={selectedMemberships.some((membership) => membership?.userId === user.id)}
                                                    onCheckStatusChange={(checked) => {
                                                        if (checked) {
                                                            handleAddSelectedMemberships(membership);
                                                        } else {
                                                            handleDeleteSelectedMemberships([membership]);
                                                        }
                                                    }}
                                                />
                                            );
                                        })
                                    }
                                    <Button
                                        variant="text"
                                        classes={{ root: 'load-more-button' }}
                                        disabled={queryClientMembersLoadingMore || queryClientMembersResponseData?.remains === 0}
                                        onClick={queryMoreClientMembers}
                                    >
                                        {
                                            queryClientMembersLoadingMore
                                                ? getLocaleText('loadings.loading')
                                                : queryClientMembersResponseData?.remains === 0
                                                    ? getLocaleText('loadings.noMore')
                                                    : getLocaleText('loadings.loadMore')
                                        }
                                    </Button>
                                </SimpleBar>
                    }
                </Box>
            </Box>
            <UserSelector
                open={userSelectorOpen}
                onClose={() => setUserSelectorOpen(false)}
                onSelectUsers={(memberships) => {
                    clientService.addClientMembers({
                        clientId,
                        memberships,
                    }).then(() => {
                        reloadQueryClientMembers();
                    });
                }}
            />
        </ClientMembersWrapper>
    );
};

export default ClientMembers;
