import {
    FC,
    useEffect,
    useState,
    MouseEvent,
} from 'react';
import { UserSelectorProps } from '@modules/user/user-selector.interface';
import Box, { BoxProps } from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import { InjectedComponentProps } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import SimpleBar from 'simplebar-react';
import clsx from 'clsx';
import _ from 'lodash';
import { UserCardProps } from '@modules/user/user-card.interface';
import { UserCardComponent } from '@modules/user/user-card.component';
import { UserService } from '@modules/user/user.service';
import { useDebounce } from 'ahooks';
import { UtilsService } from '@modules/utils/utils.service';
import { QueryUsersResponseDataItem } from '@modules/user/user.interface';
import { LoadingComponent } from '@modules/brand/loading.component';
import { Profile } from '@modules/profile/profile.interface';
import { ExceptionComponentProps } from '@modules/brand/exception.interface';
import { ExceptionComponent } from '@modules/brand/exception.component';
import styled from '@mui/material/styles/styled';

const UserSelectorWrapper = styled(Dialog)(({ theme }) => {
    return `
        .title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: transparent;
            padding-left: ${theme.spacing(1)};
            padding-right: ${theme.spacing(1)};

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
        }

        .loading-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .simplebar-content {
            display: flex;
            flex-direction: column;
            align-items: stretch;
        }

        .load-more-wrapper {
            padding: ${theme.spacing(1)};
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .selected-controls-wrapper {
            flex-grow: 1;
            flex-shrink: 1;
            display: flex;
            justify-content: flex-start;
            align-items: center;

            & > button {
                margin-left: ${theme.spacing(1)};
            }
        }

        .add-users-popover {
            width: 360px;

            .users-list-item {
                padding: ${theme.spacing(0.5)} ${theme.spacing(1)};

                .avatar {
                    width: 28px;
                    height: 28px;
                    border-radius: ${theme.spacing(0.5)};
                    margin-right: ${theme.spacing(1)};
                }

                &-text {
                    display: flex;
                    align-items: center;
                }
            }

            .search-users-wrapper {
                display: flex;
                box-sizing: border-box;
                padding: ${theme.spacing(1)};

                & > * {
                    flex-grow: 1;
                }
            }
        }
    `;
});

const UserSelector: FC<InjectedComponentProps<UserSelectorProps>> = ({
    declarations,
    className,
    onSelectUsers,
    onClose = _.noop,
    ...props
}) => {
    const localeService = declarations.get<LocaleService>(LocaleService);
    const userService = declarations.get<UserService>(UserService);
    const utilsService = declarations.get<UtilsService>(UtilsService);
    const UserCard = declarations.get<FC<UserCardProps>>(UserCardComponent);
    const Loading = declarations.get<FC<BoxProps>>(LoadingComponent);
    const Exception = declarations.get<FC<ExceptionComponentProps>>(ExceptionComponent);

    const handleOpenPopover = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedSearchValue = useDebounce(searchValue, { wait: 300 });
    const [selectedUserList, setSelectedUserList] = useState<Profile[]>([]);
    const [selectedSelectedUserIdList, setSelectedSelectedUserIdList] = useState<string[]>([]);
    const [dialogContentHeight, setDialogContentHeight] = useState<number>(0);
    const [dialogContentElement, setDialogContentElement] = useState<HTMLDivElement>(null);
    const getComponentLocaleText = localeService.useLocaleContext('components.userSelector');
    const getAppLocaleText = localeService.useLocaleContext('app');
    const {
        data: queryUsersResponseData,
        loadMore: queryMoreUsers,
        loading: queryUsersLoading,
        loadingMore: queryUsersLoadingMore,
    } = utilsService.useLoadMore<QueryUsersResponseDataItem> (
        (data) => {
            return userService.queryUsers(
                {
                    ..._.pick(data, ['lastCursor', 'size']),
                    search: debouncedSearchValue,
                },
            );
        },
        {
            reloadDeps: [debouncedSearchValue],
        },
    );

    const popoverOpen = Boolean(anchorEl);

    const handleCloseSelector = (event = {}, reason = null) => {
        if (reason === 'backdropClick' || reason !== null) {
            return;
        }

        onClose(event, reason);
        setSearchValue('');
        setSelectedUserList([]);
        setSelectedSelectedUserIdList([]);
    };

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
        <UserSelectorWrapper
            {...props}
            disableEscapeKeyDown={true}
            maxWidth="sm"
            fullWidth={true}
            className={clsx('user-selector', className)}
            onClose={handleCloseSelector}
        >
            <DialogTitle classes={{ root: 'title' }}>
                <Button
                    color="primary"
                    startIcon={<Icon className="icon icon-account-add" />}
                    onClick={handleOpenPopover}
                >{getComponentLocaleText('addUsers')}</Button>
                <Popover
                    open={popoverOpen}
                    disablePortal={true}
                    classes={{
                        paper: 'add-users-popover',
                    }}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    onClose={handleClosePopover}
                >
                    <Box className="search-users-wrapper">
                        <TextField
                            placeholder={getAppLocaleText('searchPlaceholder')}
                            onChange={(event) => setSearchValue(event.target.value)}
                        />
                    </Box>
                    {
                        queryUsersLoading
                            ? <Box
                                className="loading-wrapper"
                                style={{ height: dialogContentHeight - 1 || 320 }}
                            ><Loading /></Box>
                            : <SimpleBar style={{ maxHeight: dialogContentHeight - 1 || 320 }}>
                                <List
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        padding: 0,
                                    }}
                                >
                                    {
                                        (_.isArray(queryUsersResponseData?.list)) && queryUsersResponseData.list.map((item) => {
                                            const {
                                                id,
                                                fullName,
                                                email,
                                                picture = '/static/images/profile_avatar_fallback.svg',
                                            } = item;

                                            return (
                                                <ListItemButton
                                                    key={item.id}
                                                    title={id}
                                                    classes={{
                                                        root: 'users-list-item',
                                                    }}
                                                >
                                                    <ListItemIcon>
                                                        {
                                                            selectedUserList.some((selectedUser) => selectedUser.id === item.id) && (
                                                                <Icon className="icon icon-check" />
                                                            )
                                                        }
                                                    </ListItemIcon>
                                                    <ListItemText className="users-list-item-text">
                                                        <Box className="avatar" component="img" src={picture} />
                                                        <Typography noWrap={true}>{fullName} ({email})</Typography>
                                                    </ListItemText>
                                                </ListItemButton>
                                            );
                                        })
                                    }
                                    {
                                        !queryUsersLoading && (
                                            <Box className="load-more-wrapper">
                                                <Button
                                                    variant="text"
                                                    classes={{ root: 'load-more-button' }}
                                                    disabled={queryUsersLoadingMore || queryUsersResponseData?.remains === 0}
                                                    onClick={queryMoreUsers}
                                                >
                                                    {
                                                        getComponentLocaleText(
                                                            queryUsersLoadingMore
                                                                ? 'loading'
                                                                : queryUsersResponseData?.remains === 0
                                                                    ? 'noMore'
                                                                    : 'loadMore',
                                                        )
                                                    }
                                                </Button>
                                            </Box>
                                        )
                                    }
                                </List>
                            </SimpleBar>
                    }
                </Popover>
                <IconButton onClick={() => handleCloseSelector()}><Icon className="icon-close" /></IconButton>
            </DialogTitle>
            <DialogContent
                classes={{
                    root: 'content',
                }}
                ref={(ref) => setDialogContentElement(ref as unknown as HTMLDivElement)}
            >
                {
                    selectedUserList.length === 0
                        ? <Exception
                            imageSrc="/static/images/empty.svg"
                            title={getComponentLocaleText('noSelected.title')}
                            subTitle={getComponentLocaleText('noSelected.subTitle')}
                        />
                        : <SimpleBar style={{ maxHeight: dialogContentHeight - 1 || 720 }}>
                            {
                                selectedUserList.map((selectedUser) => {
                                    return (
                                        <UserCard
                                            key={selectedUser.id}
                                            profile={selectedUser}
                                            checked={selectedSelectedUserIdList.indexOf(selectedUser.id) !== -1}
                                            menu={[
                                                {
                                                    icon: 'icon-close',
                                                    title: getComponentLocaleText('clearSelected'),
                                                    onActive: () => {
                                                        setSelectedUserList(selectedUserList.filter((user) => {
                                                            return user.id !== selectedUser.id;
                                                        }));
                                                    },
                                                },
                                            ]}
                                            onCheckStatusChange={(checked) => {
                                                if (checked) {
                                                    setSelectedSelectedUserIdList(_.uniq(selectedSelectedUserIdList.concat(selectedUser.id)));
                                                } else {
                                                    setSelectedSelectedUserIdList(selectedSelectedUserIdList.filter((userId) => {
                                                        return userId !== selectedUser.id;
                                                    }));
                                                }
                                            }}
                                        />
                                    );
                                })
                            }
                        </SimpleBar>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleCloseSelector()}>{getComponentLocaleText('cancel')}</Button>
                <Button
                    color="primary"
                    disabled={selectedUserList.length === 0}
                    onClick={() => {
                        onSelectUsers(selectedUserList);
                        handleCloseSelector();
                    }}
                >{getComponentLocaleText('ok')}</Button>
            </DialogActions>
        </UserSelectorWrapper>
    );
};

export default UserSelector;
