/* eslint-disable no-unused-vars */
import {
    FC,
    useState,
    useEffect,
    MouseEvent,
} from 'react';
import {
    ChannelListItemMenuProps,
    ChannelListItemMode,
    ChannelListItemProps,
} from '@modules/channel/channel-list-item.interface';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import styled from '@mui/material/styles/styled';
import clsx from 'clsx';
import _ from 'lodash';
import Color from 'color';
import Menu from '@mui/material/Menu';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

const ChannelListItemWrapper = styled('div')(({ theme }) => {
    const mode = theme.palette.mode;
    return `
        height: 120px;
        cursor: pointer;
        display: inline-block;
        user-select: none;
        position: relative;

        &.appearance-list-item {
            display: block;
            height: auto;

            .action-wrapper {
                top: 0;
                left: initial;
                flex-wrap: nowrap;
            }

            .content-wrapper {
                padding: 15px 0;
                padding-left: 15px;
                flex-direction: row;
                justify-content: flex-start;

                img {
                    margin-right: 10px;
                }

                .text {
                    margin-top: 0;
                }
            }
        }

        &.handle-click {
            &:active:focus,
            &:active:not(:focus):not(:focus-within) {
                background-color: ${mode === 'dark' ? 'rgba(255, 255, 255, 0.01)' : 'rgba(0, 0, 0, 0.05)'};
            }
        }

        &:hover {
            background-color: ${mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'};

            .action-wrapper {
                display: flex;
            }
        }

        .action-wrapper {
            padding-right: 5px;
            display: none;
            justify-content: flex-end;
            align-items: center;
            position: absolute;
            right: 0;
            bottom: 0;
            left: 0;
            padding: 5px;
            background-color: ${mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
            cursor: default;

            .control-button {
                color: ${theme.palette.background.default};
                background-color: transparent;

                &:hover {
                    background-color: ${Color(theme.palette.background.default).alpha(0.2).toString()};
                }

                &:active {
                    background-color: ${Color(theme.palette.background.default).alpha(0.1).toString()};
                }
            }
        }

        .content-wrapper {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            img {
                pointer-events: none;
            }

            .text {
                color: ${theme.palette.text.primary};
                margin-top: 10px;
            }
        }
    `;
});

const ChannelListItemMenu: FC<ChannelListItemMenuProps> = ({
    menu = [],
    IconButtonProps = {},
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        menu.length !== 0
            ? <>
                <IconButton
                    {...IconButtonProps}
                    onClick={handleClick}
                >
                    <Icon className="icon icon-more-horizontal" />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    disablePortal={true}
                    onClose={handleClose}
                >
                    {
                        menu.map((menuItem, index) => {
                            const {
                                icon,
                                title,
                                onClick,
                            } = menuItem;

                            return (
                                <ListItemButton
                                    key={index}
                                    style={{ minWidth: 180 }}
                                    onClick={(event) => {
                                        if (_.isFunction(onClick)) {
                                            onClick(event);
                                        }
                                        setAnchorEl(null);
                                    }}
                                >
                                    <ListItemIcon>
                                        <Icon className={clsx('icon', icon)} />
                                    </ListItemIcon>
                                    <ListItemText
                                        sx={{
                                            maxWidth: '240px',
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                            whitespace: 'nowrap',
                                        }}
                                        title={title}
                                    >{title}</ListItemText>
                                </ListItemButton>
                            );
                        })
                    }
                </Menu>
            </>
            : null
    );
};

const ChannelListItem: FC<ChannelListItemProps> = ({
    data = {},
    style,
    width,
    mode = 'app-entry',
    menu = [],
    onClick,
}) => {
    const {
        name,
        avatar,
        description = '',
    } = data;

    let channelListItemDisplayMode: ChannelListItemMode;

    if (mode === 'app-entry' || mode === 'list-item') {
        channelListItemDisplayMode = mode;
    } else {
        channelListItemDisplayMode = 'app-entry';
    }

    const [shouldHaveClickClass, setShouldHaveClickClass] = useState<boolean>(true);

    useEffect(() => {
        const handler = () => {
            setShouldHaveClickClass(true);
        };

        window.addEventListener('mouseup', handler);

        return () => {
            window.removeEventListener('mouseup', handler);
        };
    }, []);

    return (
        <ChannelListItemWrapper
            style={{
                ...style,
                ...(
                    channelListItemDisplayMode === 'list-item'
                        ? { width: 'initial' }
                        : { width }
                ),
            }}
            className={clsx({
                'handle-click': shouldHaveClickClass,
                'appearance-list-item': channelListItemDisplayMode === 'list-item',
            })}
            title={description}
            onClick={onClick}
        >
            {
                menu.length > 0 && (
                    <Box
                        className="action-wrapper"
                        sx={
                            channelListItemDisplayMode === 'list-item'
                                ? {
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }
                                : {}
                        }
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                        onMouseDown={() => {
                            setShouldHaveClickClass(false);
                        }}
                        onMouseUp={() => {
                            setShouldHaveClickClass(true);
                        }}
                    >
                        {
                            menu.slice(0, 1).map((menuItem, index) => {
                                return (
                                    <IconButton
                                        key={index}
                                        classes={{ root: 'control-button' }}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            if (_.isFunction(menuItem.onClick)) {
                                                menuItem.onClick(event);
                                            }
                                        }}
                                    >
                                        <Icon className={clsx('icon', menuItem.icon)} />
                                    </IconButton>
                                );
                            })
                        }
                        {
                            menu.slice(1).length > 0 && (
                                <ChannelListItemMenu
                                    menu={menu.slice(1)}
                                    IconButtonProps={{
                                        classes: {
                                            root: 'control-button',
                                        },
                                    }}
                                />
                            )
                        }
                    </Box>
                )
            }
            <Box className="content-wrapper">
                <Box
                    component="img"
                    style={{
                        width: width * 0.3,
                        height: width * 0.3,
                    }}
                    src={avatar || '/static/images/channel_avatar_fallback.svg'}
                />
                <Typography classes={{ root: 'text' }} variant="subtitle2">{name}</Typography>
            </Box>
        </ChannelListItemWrapper>
    );
};

export default ChannelListItem;
