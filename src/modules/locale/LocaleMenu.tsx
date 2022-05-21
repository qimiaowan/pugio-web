import {
    FC,
    useState,
    MouseEvent,
} from 'react';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { LocaleMenuProps } from '@modules/locale/locale.interface';
import _ from 'lodash';

const LocaleMenu: FC<LocaleMenuProps> = ({
    locales = [],
    selectedLocaleId = 'en_US',
    onLocaleChange = _.noop,
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
        locales.length === 0
            ? null
            : <Box>
                <IconButton
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                ><Icon className="icon-language" /></IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    {
                        locales.map((localeItem) => {
                            const { title, id } = localeItem;

                            return (
                                <ListItemButton
                                    key={id}
                                    selected={selectedLocaleId === id}
                                    onClick={() => {
                                        onLocaleChange(localeItem);
                                        handleClose();
                                    }}
                                >
                                    <ListItemIcon>
                                        {
                                            selectedLocaleId === id && <Icon className="icon-check" />
                                        }
                                    </ListItemIcon>
                                    <ListItemText>{title}</ListItemText>
                                </ListItemButton>
                            );
                        })
                    }
                </Menu>
            </Box>
    );
};

export default LocaleMenu;
