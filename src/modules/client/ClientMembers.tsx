import {
    createElement,
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
import { QueryClientMembersResponseDataItem } from '@modules/client/client.interface';
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
import '@modules/client/client-members.component.less';
import { LocaleService } from '@modules/locale/locale.service';
import { LoadingComponent } from '@modules/brand/loading.component';
import { ExceptionProps } from '@modules/brand/exception.interface';
import { ExceptionComponent } from '@modules/brand/exception.component';
import { UserCardProps } from '@modules/user/user-card.interface';
import { UserCardComponent } from '@modules/user/user-card.component';
import { Map } from 'immutable';
import { useDialog } from 'muibox';
import { useSnackbar } from 'notistack';
import { UserSelectorProps } from '@modules/user/user-selector.interface';
import { UserSelectorComponent } from '@modules/user/user-selector.component';
import { StoreService } from '@modules/store/store.service';
import SimpleBar from 'simplebar-react';

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

    const { client_id: clientId } = useParams();
    const getLocaleText = localeService.useLocaleContext();
    const getPageLocaleText = localeService.useLocaleContext('pages.clientMembers');
    const getComponentLocaleText = localeService.useLocaleContext('components');
    const [searchValue, setSearchValue] = useState<string>('');
    const [role, setRole] = useState<number>(2);
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
        (data) => clientService.queryClientMembers(
            {
                clientId,
                role,
                ..._.pick(data, ['lastCursor', 'size']),
                search: debouncedSearchValue,
            },
        ),
        {
            reloadDeps: [
                clientId,
                role,
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
    );
    const [
        selectedMembersMap,
        setSelectedMembersMap,
    ] = useState<Map<number, string[]>>(Map<number, string[]>());
    const dialog = useDialog();
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

    const handleAddSelectedMembersToList = (role: number, memberIdList: string[]) => {
        setSelectedMembersMap(
            selectedMembersMap.set(
                role,
                _.uniq((selectedMembersMap.get(role) || []).concat(memberIdList)),
            ),
        );
    };

    const handleDeleteSelectedMembersFromList = (role: number, memberIdList: string[]) => {
        if (!_.isArray(selectedMembersMap.get(role))) {
            setSelectedMembersMap(selectedMembersMap.set(role, []));
            return;
        }

        setSelectedMembersMap(
            selectedMembersMap.set(
                role,
                selectedMembersMap.get(role).filter((memberId) => {
                    return memberIdList.indexOf(memberId) === -1;
                }),
            ),
        );
    };

    const handleDeleteSelectedMembers = (role: number, memberIdList: string[]) => {
        dialog.confirm({
            title: getComponentLocaleText('muibox.confirm'),
            message: getPageLocaleText('deleteConfirm', { count: memberIdList.length }),
            ok: {
                variant: 'contained',
                color: 'primary',
                text: 'OK',
            },
            cancel: {
                text: 'Cancel',
            },
        })
            .then(() => {
                clientService.deleteClientMembers({
                    clientId,
                    users: memberIdList,
                })
                    .then((response) => {
                        const deletedUsers = response?.response || [];
                        setSelectedMembersMap(
                            selectedMembersMap.set(
                                role,
                                selectedMembersMap.get(role).filter((userId) => {
                                    return !deletedUsers.some((selectedMembership) => selectedMembership?.user.id === userId);
                                }),
                            ),
                        );
                        reloadQueryClientMembers();
                    })
                    .catch(() => enqueueSnackbar(getPageLocaleText('exceptions.deleteMembers'), {
                        variant: 'error',
                    }));
            })
            .catch(_.noop);
    };

    useEffect(() => {
        if (userClientRelationResponseData?.response) {
            const { roleType } = userClientRelationResponseData.response;

            if (roleType === 0) {
                setTabs([
                    {
                        title: 'tabs.members',
                        query: {
                            role: 2,
                        },
                    },
                    {
                        title: 'tabs.admins',
                        query: {
                            role: 1,
                        },
                    },
                ]);
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

    return (
        <Box
            {...props}
            className={clsx('client-members', className)}
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
                                                onClick={() => {
                                                    if (typeof query?.role === 'number') {
                                                        setRole(query.role);
                                                    }
                                                }}
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
                    {
                        (_.isArray(selectedMembersMap.get(role)) && selectedMembersMap.get(role).length > 0) && (
                            <Button
                                color="error"
                                startIcon={<Icon className="icon-delete" />}
                                title={getPageLocaleText('delete', { count: selectedMembersMap.get(role).length })}
                                onClick={() => handleDeleteSelectedMembers(role, selectedMembersMap.get(role))}
                            >{selectedMembersMap.get(role).length}</Button>
                        )
                    }
                </Box>
                <Box className="header-controls-wrapper">
                    <Button
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
                            : queryClientMembersResponseData?.list.length === 0
                                ? <Exception
                                    imageSrc="/static/images/empty.svg"
                                    title={getPageLocaleText('empty.title')}
                                    subTitle={getPageLocaleText('empty.subTitle')}
                                />
                                : <SimpleBar style={{ width: membersContainerWidth, height: membersContainerHeight }}>
                                    {
                                        queryClientMembersResponseData.list.map((listItem) => {
                                            const {
                                                id,
                                                user,
                                            } = listItem;

                                            return createElement(
                                                UserCard,
                                                {
                                                    key: id,
                                                    profile: user,
                                                    menu: [
                                                        {
                                                            icon: 'icon-delete',
                                                            title: getPageLocaleText('userCardMenu.delete'),
                                                            onActive: () => handleDeleteSelectedMembers(role, [user.id]),
                                                        },
                                                    ],
                                                    checked: (selectedMembersMap.get(role) || []).indexOf(user.id) !== -1,
                                                    onCheckStatusChange: (checked) => {
                                                        if (checked) {
                                                            handleAddSelectedMembersToList(role, [user.id]);
                                                        } else {
                                                            handleDeleteSelectedMembersFromList(role, [user.id]);
                                                        }
                                                    },
                                                },
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
            />
        </Box>
    );
};

export default ClientMembers;
