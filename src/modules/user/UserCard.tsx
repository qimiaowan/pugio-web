import {
    FC,
    useState,
    MouseEvent,
} from 'react';
import Box from '@mui/material/Box';
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
                                        <Typography variant="body2" color="text.secondary">{extra}</Typography>
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

    return (
        <Box
            {...props}
            className={clsx('user-card', className)}
        >
            <Box className="avatar" component="img" src={avatar} />
            <Box className="description">
                <Typography variant="h6" noWrap={true}>{title}{extraTitle ? ` (${extraTitle})` : ''}</Typography>
                <Typography variant="subtitle2">{subTitle}</Typography>
            </Box>
            {
                menu.length > 0 && (
                    <Box className="controls">
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
                                        onClick={onActive}
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
