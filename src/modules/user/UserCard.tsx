import {
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
import '@modules/user/user-card.component.less';
import { InjectedComponentProps } from 'khamsa';
import { UtilsService } from '@modules/utils/utils.service';
import _ from 'lodash';

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
        <Box
            {...props}
            className={clsx('user-card', { checked }, className)}
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
        </Box>
    );
};

export default UserCard;
