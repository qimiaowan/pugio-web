import {
    cloneElement,
    FC,
    useState,
    MouseEvent,
} from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
    UserCardProps,
    UserCardMenuProps,
} from '@modules/user/user-card.interface';
import clsx from 'clsx';
import { InjectedComponentProps } from 'khamsa';
import { UtilsService } from '@modules/utils/utils.service';
import _ from 'lodash';
import styled from '@mui/material/styles/styled';

const UserCardWrapper = styled(Box)(({ theme }) => {
    const mode = theme.palette.mode;

    return `
        display: flex;
        align-items: stretch;
        box-sizing: border-box;
        padding: ${theme.spacing(1)};
        align-items: center;
        border-bottom: 1px solid ${theme.palette.divider};
        cursor: pointer;

        &, * {
            user-select: none;
        }

        &:hover, &.checked:hover {
            background-color: ${mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100]};
        }

        &:active:focus,
        &:active:not(:focus):not(:focus-within) {
            background-color: ${mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[200]};
        }

        &.checked {
            background-color: ${mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[200]};
        }

        .avatar {
            flex-grow: 0;
            flex-shrink: 0;
            pointer-events: none;
            width: 50px;
            height: 50px;
            border-radius: 10px;
            margin-right: ${theme.spacing(1)};
        }

        .description {
            flex-grow: 1;
            flex-shrink: 1;
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            .title, .subtitle {
                max-width: 480px;
            }

            .title {
                padding-right: 0;
                padding-left: 0;
            }
        }

        .controls-button-wrapper {
            flex-grow: 0;
            flex-shrink: 0;
            display: flex;
            align-items: center;

            & > * {
                margin-right: ${theme.spacing(1)};

                &:last-child {
                    margin-right: 0;
                }
            }
        }

        .checkbox-wrapper {
            width: 50px;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    `;
});

const UserCardMenu: FC<UserCardMenuProps> = ({
    menu = [],
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
        <Box>
            <IconButton onClick={handleClick}>
                <Icon className="icon-more-horizontal" />
            </IconButton>
            <Menu
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
            >
                {
                    menu.map((menuItem, index) => {
                        const {
                            icon,
                            title,
                            extra = '',
                            onActive = _.noop,
                        } = menuItem;

                        return (
                            <MenuItem key={index} onClick={onActive}>
                                <ListItemIcon><Icon className={icon} /></ListItemIcon>
                                <ListItemText>{title}</ListItemText>
                                {
                                    extra && (
                                        <ListItemText classes={{ root: 'list-item-extra-text' }}>
                                            <Typography variant="body2" color="text.secondary">{extra}</Typography>
                                        </ListItemText>
                                    )
                                }
                            </MenuItem>
                        );
                    })
                }
            </Menu>
        </Box>
    );
};

const UserCard: FC<InjectedComponentProps<UserCardProps>> = ({
    profile,
    menu = [],
    className = '',
    declarations,
    checkable = true,
    checked = false,
    controlSlot,
    checkboxProps = {},
    onCheckStatusChange = _.noop,
    onClick = _.noop,
    ...props
}) => {
    const utilsService = declarations.get<UtilsService>(UtilsService);

    const iconButtons = menu.slice(0, 2);
    const menuListItems = menu.slice(2);
    const {
        avatar,
        title,
        extraTitle,
        subTitle,
    } = utilsService.generateUserDescription(profile);

    const [controlsVisible, setControlsVisible] = useState<boolean>(false);

    return (
        <UserCardWrapper
            {...props}
            className={clsx({ checked }, className)}
            onMouseEnter={() => setControlsVisible(true)}
            onMouseLeave={() => setControlsVisible(false)}
            onClick={(event) => {
                onClick(event);
                onCheckStatusChange(!checked);
            }}
        >
            {
                checkable && (
                    <Box className="checkbox-wrapper">
                        {
                            (controlsVisible || checked) && (
                                <Checkbox
                                    {...checkboxProps}
                                    checked={checked}
                                    onChange={(event) => onCheckStatusChange(event.target.checked)}
                                />
                            )
                        }
                    </Box>
                )
            }
            <Box className="avatar" component="img" src={avatar} />
            <Box className="description">
                <Typography
                    variant="subtitle1"
                    noWrap={true}
                    classes={{ root: 'title' }}
                    title={extraTitle}
                >{title}{extraTitle ? ` (${extraTitle})` : ''}</Typography>
                <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    noWrap={true}
                    classes={{ root: 'subtitle' }}
                    title={subTitle}
                >{subTitle}</Typography>
            </Box>
            {
                (menu.length > 0 && controlsVisible) && (
                    <Box className="controls-button-wrapper">
                        {
                            controlSlot && cloneElement(controlSlot)
                        }
                        {
                            iconButtons.map((iconButton, index) => {
                                const {
                                    icon = '',
                                    title = '',
                                    onActive = _.noop,
                                } = iconButton;

                                return (
                                    <IconButton
                                        key={index}
                                        title={title}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            onActive();
                                        }}
                                    ><Icon className={icon} /></IconButton>
                                );
                            })
                        }
                        {
                            menuListItems.length > 0 && (
                                <UserCardMenu menu={menuListItems} />
                            )
                        }
                    </Box>
                )
            }
        </UserCardWrapper>
    );
};

export default UserCard;
