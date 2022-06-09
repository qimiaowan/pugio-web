import {
    FC,
    useEffect,
    useState,
} from 'react';
import Avatar from '@mui/material/Avatar';
import Box, { BoxProps } from '@mui/material/Box';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import { getContainer } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import SimpleBar from 'simplebar-react';
import _ from 'lodash';
import { UserService } from '@modules/user/user.service';
import { useDebounce } from 'ahooks';
import { UtilsService } from '@modules/utils/utils.service';
import { QueryUsersResponseDataItem } from '@modules/user/user.interface';
import { LoadingComponent } from '@modules/brand/loading.component';
import styled from '@mui/material/styles/styled';
import { PopoverProps } from '@modules/common/popover.interface';
import { PopoverComponent } from '@modules/common/popover.component';
import { UserSearcherProps } from '@modules/user/user-searcher.interface';

const UserSearcherWrapper = styled(Box)(({ theme }) => {
    return `
        width: 360px;

        .users-list-item {
            padding: ${theme.spacing(0.5)} ${theme.spacing(1)};

            .avatar {
                width: 28px;
                height: 28px;
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
            border-bottom: 1px solid ${theme.palette.divider};

            & > * {
                flex-grow: 1;
            }
        }

        .load-more-wrapper {
            padding: ${theme.spacing(1)};
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .loading-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    `;
});

const UserSearcher: FC<UserSearcherProps> = ({
    className,
    Trigger,
    mode = 'multiple',
    selectedUsers = [],
    onUsersSelected = _.noop,
    ...props
}) => {
    const container = getContainer(UserSearcher);
    const localeService = container.get<LocaleService>(LocaleService);
    const userService = container.get<UserService>(UserService);
    const utilsService = container.get<UtilsService>(UtilsService);
    const Loading = container.get<FC<BoxProps>>(LoadingComponent);
    const Popover = container.get<FC<PopoverProps>>(PopoverComponent);

    const [searchValue, setSearchValue] = useState<string>('');
    const debouncedSearchValue = useDebounce(searchValue, { wait: 300 });
    const [popoverContentElement, setPopoverContentElement] = useState<HTMLElement>(null);
    const [popoverContentHeight, setPopoverContentHeight] = useState<number>(0);
    const getComponentLocaleText = localeService.useLocaleContext('components.userSearcher');
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

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            const [observationData] = entries;

            if (observationData) {
                const blockSize = _.get(observationData, 'borderBoxSize[0].blockSize');

                if (_.isNumber(blockSize)) {
                    setPopoverContentHeight(blockSize);
                }
            }
        });

        if (popoverContentElement) {
            observer.observe(popoverContentElement);
        }

        return () => {
            observer.disconnect();
        };
    }, [popoverContentElement]);

    return (
        <Popover
            Trigger={Trigger}
        >
            {
                ({ closePopover }) => {
                    return (
                        <UserSearcherWrapper {...props}>
                            <Box className="search-users-wrapper">
                                <TextField
                                    placeholder={getAppLocaleText('searchPlaceholder')}
                                    InputProps={{
                                        startAdornment: <Icon className="icon-search" />,
                                        sx: {
                                            border: 0,
                                        },
                                    }}
                                    onChange={(event) => setSearchValue(event.target.value)}
                                />
                            </Box>
                            {
                                queryUsersLoading
                                    ? <Box
                                        className="loading-wrapper"
                                        style={{ height: popoverContentHeight || 320 }}
                                    ><Loading /></Box>
                                    : <SimpleBar style={{ maxHeight: 320 }}>
                                        <Box ref={(element) => setPopoverContentElement(element as unknown as HTMLElement)}>
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
                                                                selected={selectedUsers.some((user) => user.id === id)}
                                                                onClick={() => {
                                                                    let users = Array.from(selectedUsers);
                                                                    if (mode === 'multiple') {
                                                                        if (!users.some((user) => user.id === id)) {
                                                                            users = [item].concat(users);
                                                                        } else {
                                                                            users = users.filter((user) => user.id !== id);
                                                                        }
                                                                    } else if (mode === 'single') {
                                                                        users = [item];
                                                                    }
                                                                    onUsersSelected(users, closePopover);
                                                                }}
                                                            >
                                                                {
                                                                    mode === 'multiple' && (
                                                                        <ListItemIcon>
                                                                            {
                                                                                selectedUsers.some((user) => user.id === item.id) && (
                                                                                    <Icon className="icon icon-check" />
                                                                                )
                                                                            }
                                                                        </ListItemIcon>
                                                                    )
                                                                }
                                                                <ListItemText className="users-list-item-text" disableTypography={true}>
                                                                    <Avatar
                                                                        classes={{ root: 'avatar' }}
                                                                        src={picture}
                                                                        variant="rounded"
                                                                    />
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
                                        </Box>
                                    </SimpleBar>
                            }
                        </UserSearcherWrapper>
                    );
                }
            }
        </Popover>
    );
};

export default UserSearcher;
