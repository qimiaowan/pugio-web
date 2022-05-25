import {
    FC,
    useState,
} from 'react';
import { ClientRoleSelectorProps } from '@/modules/client/client-role-selector.interface';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import Menu from '@mui/material/Menu';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { InjectedComponentProps } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import _ from 'lodash';

const ClientRoleSelector: FC<InjectedComponentProps<ClientRoleSelectorProps>> = ({
    declarations,
    role,
    triggerProps = {},
    menuProps = {},
    listItemButtonProps,
    onRoleChange = _.noop,
}) => {
    const localeService = declarations.get<LocaleService>(LocaleService);

    const getLocaleText = localeService.useLocaleContext('components.clientRoleSelector');
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>(null);

    const open = Boolean(anchorEl);

    return (
        <>
            <Button
                variant="text"
                endIcon={<Icon className="icon-keyboard-arrow-down" />}
                {...triggerProps}
                onClick={(event) => {
                    event.stopPropagation();
                    setAnchorEl(event.currentTarget);
                }}
            >{getLocaleText(`roles[${role}]`) || getLocaleText('unknown')}</Button>
            <Menu
                {...menuProps}
                anchorEl={anchorEl}
                onBackdropClick={(event) => event.stopPropagation()}
                open={open}
                onClose={() => setAnchorEl(null)}
            >
                {
                    new Array(2).fill(null).map((value, index) => {
                        const currentRole = index + 1;

                        return (
                            <ListItemButton
                                key={index}
                                selected={currentRole === role}
                                {
                                    ...(
                                        listItemButtonProps
                                            ? typeof listItemButtonProps === 'function'
                                                ? listItemButtonProps(role, currentRole === role)
                                                : listItemButtonProps
                                            : {}
                                    )
                                }
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onRoleChange(currentRole);
                                }}
                            >
                                <ListItemIcon>
                                    {
                                        currentRole === role && <Icon className="icon-check" />
                                    }
                                </ListItemIcon>
                                <ListItemText>
                                    <Typography noWrap={true} sx={{ minWidth: 180, maxWidth: 240 }}>{getLocaleText(`roles[${currentRole}]`)}</Typography>
                                </ListItemText>
                            </ListItemButton>
                        );
                    })
                }
            </Menu>
        </>
    );
};

export default ClientRoleSelector;
