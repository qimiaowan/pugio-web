import { forwardContainer } from 'khamsa';
import {
    FC,
    memo,
    PropsWithChildren,
    useEffect,
    useState,
} from 'react';
import {
    NavLink,
    Outlet,
} from 'react-router-dom';
import { LocaleService } from '@modules/locale/locale.service';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { StyledEngineProvider } from '@mui/material/styles';
import styled from '@mui/material/styles/styled';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import { LocaleListItem } from '@modules/locale/locale.interface';
import { BrandService } from '@modules/brand/brand.service';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { ProfileMenuComponent } from '@modules/profile/profile-menu.component';
import { ClientsDropdownComponent } from '@modules/clients/clients-dropdown.component';
import { StoreService } from '@modules/store/store.service';
import { ClientsDropdownProps } from '@modules/clients/clients-dropdown.interface';
import { ContainerProps } from '@modules/container/container.interface';
import _ from 'lodash';
import { SnackbarProvider } from 'notistack';
import { ConfirmDialogProvider } from 'react-mui-confirm';
import Color from 'color';
import { PopoverProps } from '@modules/common/popover.interface';
import { PopoverComponent } from '@modules/common/popover.component';

const ContainerWrapper = styled(Box)(({ theme }) => {
    const mode = theme.palette.mode;

    return `
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        background-color: ${mode === 'dark' ? 'black' : 'white'};
        position: relative;

        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            position: absolute;
            top: 0;
            background-color: ${mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50]};
            border-bottom: 1px solid ${theme.palette.divider};

            .logo {
                width: 36px;
                height: 36px;
                pointer-events: none;

                svg {
                    border-radius: 6px;
                }
            }

            .wrapper {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding: 0 calc(${theme.spacing(1)} / 2);

                &.avatar-and-locales {
                    .control-button {
                        font-weight: 500;
                    }

                    & > * {
                        margin: 0 ${theme.spacing(0.5)};
                    }

                    .right-button {
                        padding: ${theme.spacing(1)};
                    }
                }

                &.logo-and-nav > * {
                    margin: 0 ${theme.spacing(1)};
                }

                .navlink {
                    text-decoration: none;
                }

                .link {
                    font-size: 14px;
                    color: ${theme.palette.text.primary};
                    text-decoration: none;
                    background-color: transparent;

                    &:hover {
                        color: ${Color(theme.palette.text.primary)[mode === 'dark' ? 'lighten' : 'darken'](0.2).alpha(0.8)};
                    }
                }
            }

            * {
                user-select: none;
            }
        }

        .content-layer {
            height: 100%;
        }
    `;
});

const Container: FC<PropsWithChildren<ContainerProps>> = forwardContainer(({
    props,
    container,
}) => {
    const { onLocaleChange = _.noop } = props;
    const brandService = container.get<BrandService>(BrandService);
    const localeService = container.get<LocaleService>(LocaleService);
    const storeService = container.get<StoreService>(StoreService);
    const ProfileMenu = container.get<FC>(ProfileMenuComponent);
    const ClientsDropdown = container.get<FC<ClientsDropdownProps>>(ClientsDropdownComponent);
    const Popover = container.get<FC<PopoverProps>>(PopoverComponent);

    const theme = brandService.getTheme();

    const [locales, setLocales] = useState<LocaleListItem[]>([]);
    const [locale, setLocale] = useState(localStorage.getItem('locale') || 'en_US');
    const [logo, setLogo] = useState<string>('');
    const getLocaleText = localeService.useLocaleContext();
    const appNavbarHeight = storeService.useStore((state) => state.appNavbarHeight);

    useEffect(() => {
        localStorage.setItem('locale', locale);
        onLocaleChange(locale);
    }, [locale]);

    useEffect(() => {
        localeService.getLocales().then((locales) => setLocales(locales));
    }, []);

    useEffect(() => {
        if (!logo) {
            setLogo(brandService.getVectors('logo'));
        }
    }, [logo]);

    return (
        <ThemeProvider theme={theme}>
            <StyledEngineProvider injectFirst={true}>
                <ConfirmDialogProvider
                    cancelButtonProps={{
                        color: 'secondary',
                    }}
                >
                    <SnackbarProvider autoHideDuration={5000}>
                        <ContainerWrapper style={{ paddingTop: appNavbarHeight }}>
                            <Box className="navbar" style={{ height: appNavbarHeight }}>
                                <Box className="wrapper logo-and-nav">
                                    <Box
                                        className="logo"
                                        dangerouslySetInnerHTML={{ __html: logo }}
                                    />
                                    <ClientsDropdown />
                                    <NavLink to="/home" className="navlink">
                                        {
                                            <Button
                                                classes={{
                                                    root: 'link',
                                                }}
                                            >{getLocaleText('app.navbar.home')}</Button>
                                        }
                                    </NavLink>
                                    {/* <NavLink to="/explore" className="navlink">
                                        {
                                            <Button
                                                classes={{
                                                    root: 'link',
                                                }}
                                            >{getLocaleText('app.navbar.explore')}</Button>
                                        }
                                    </NavLink>
                                    <NavLink to="/development" className="navlink">
                                        {
                                            <Button
                                                classes={{
                                                    root: 'link',
                                                }}
                                            >{getLocaleText('app.navbar.development')}</Button>
                                        }
                                    </NavLink> */}
                                    <a target="_blank" href="https://github.com/pugiojs/pugio-web/issues" className="navlink">
                                        {
                                            <Button
                                                classes={{
                                                    root: 'link',
                                                }}
                                            >{getLocaleText('app.navbar.issues')}</Button>
                                        }
                                    </a>
                                </Box>
                                <Box className="wrapper avatar-and-locales">
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                        classes={{ sizeSmall: 'control-button' }}
                                        startIcon={<Icon className="icon-plus" />}
                                    >{getLocaleText('app.createClient')}</Button>
                                    <NavLink to="/settings" className="navlink">
                                        <IconButton
                                            classes={{ root: 'right-button' }}
                                        >
                                            <Icon className="icon-settings" />
                                        </IconButton>
                                    </NavLink>
                                    <Popover
                                        variant="menu"
                                        Trigger={({ open, openPopover }) => {
                                            return (
                                                <IconButton
                                                    aria-haspopup="true"
                                                    aria-expanded={open ? 'true' : undefined}
                                                    classes={{ root: 'right-button' }}
                                                    sx={{
                                                        ...(open ? {
                                                            backgroundColor: theme.palette.mode === 'dark'
                                                                ? theme.palette.grey[700]
                                                                : theme.palette.grey[300],
                                                        } : {}),
                                                    }}
                                                    onClick={openPopover}
                                                ><Icon className="icon-globe" /></IconButton>
                                            );
                                        }}
                                    >
                                        {({ closePopover }) => {
                                            return (
                                                <>
                                                    {
                                                        locales.map((localeItem) => {
                                                            const { title, id } = localeItem;

                                                            return (
                                                                <ListItemButton
                                                                    key={id}
                                                                    selected={locale === id}
                                                                    onClick={() => {
                                                                        setLocale(id);
                                                                        closePopover();
                                                                    }}
                                                                >
                                                                    <ListItemIcon>
                                                                        {
                                                                            locale === id && <Icon className="icon-check" />
                                                                        }
                                                                    </ListItemIcon>
                                                                    <ListItemText>{title}</ListItemText>
                                                                </ListItemButton>
                                                            );
                                                        })
                                                    }
                                                </>
                                            );
                                        }}
                                    </Popover>
                                    <ProfileMenu />
                                </Box>
                            </Box>
                            <Box className="content-layer">
                                <Outlet />
                            </Box>
                        </ContainerWrapper>
                    </SnackbarProvider>
                </ConfirmDialogProvider>
            </StyledEngineProvider>
        </ThemeProvider>
    );
});

export default memo(Container);
