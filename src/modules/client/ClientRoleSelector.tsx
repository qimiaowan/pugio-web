import { FC } from 'react';
import { ClientRoleSelectorProps } from '@/modules/client/client-role-selector.interface';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { getContainer } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import _ from 'lodash';
import { PopoverProps } from '@modules/common/popover.interface';
import { PopoverComponent } from '@modules/common/popover.component';
import useTheme from '@mui/material/styles/useTheme';

const ClientRoleSelector: FC<ClientRoleSelectorProps> = ({
    role,
    triggerProps = {},
    popoverProps = {},
    listItemButtonProps,
    onRoleChange = _.noop,
}) => {
    const container = getContainer(ClientRoleSelector);
    const localeService = container.get<LocaleService>(LocaleService);
    const Popover = container.get<FC<PopoverProps>>(PopoverComponent);

    const theme = useTheme();
    const getLocaleText = localeService.useLocaleContext('components.clientRoleSelector');

    return (
        <Popover
            variant="menu"
            Trigger={({ open, openPopover }) => {
                return (
                    <Button
                        variant="text"
                        endIcon={<Icon className={`icon-keyboard-arrow-${open ? 'up' : 'down'}`} />}
                        {...triggerProps}
                        sx={{
                            ...(open ? {
                                backgroundColor: theme.palette.mode === 'dark'
                                    ? theme.palette.grey[700]
                                    : theme.palette.grey[300],
                            } : {}),
                        }}
                        onClick={(event) => {
                            event.stopPropagation();
                            openPopover(event);
                        }}
                    >{getLocaleText(`roles[${role}]`) || getLocaleText('unknown')}</Button>
                );
            }}
            muiPopoverProps={{
                ...popoverProps,
                onBackdropClick: (event) => event.stopPropagation(),
            }}
        >
            {
                ({ closePopover }) => {
                    return (
                        <>
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
                                                closePopover();
                                            }}
                                        >
                                            <ListItemIcon>
                                                {
                                                    currentRole === role && <Icon className="icon-check" />
                                                }
                                            </ListItemIcon>
                                            <ListItemText
                                                primaryTypographyProps={{
                                                    noWrap: true,
                                                    style: {
                                                        minWidth: 64,
                                                        maxWidth: 120,
                                                    },
                                                }}
                                            >{getLocaleText(`roles[${currentRole}]`)}</ListItemText>
                                        </ListItemButton>
                                    );
                                })
                            }
                        </>
                    );
                }
            }
        </Popover>
    );
};

export default ClientRoleSelector;
