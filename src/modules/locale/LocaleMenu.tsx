import {
    FC,
    useState,
    MouseEvent,
} from 'react';
import noop from 'lodash/noop';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import LanguageTwoToneIcon from '@mui/icons-material/LanguageTwoTone';
import { LocaleMenuProps } from './locale.interface';

const LocaleMenu: FC<LocaleMenuProps> = ({
    locales = [],
    onLocaleChange = noop,
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
            : <div>
                <IconButton
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                ><LanguageTwoToneIcon /></IconButton>
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
                                <MenuItem
                                    key={id}
                                    onClick={() => {
                                        onLocaleChange(localeItem);
                                        handleClose();
                                    }}
                                >
                                    <ListItemText>{title}</ListItemText>
                                </MenuItem>
                            );
                        })
                    }
                </Menu>
            </div>
    );
};

export default LocaleMenu;
