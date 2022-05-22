import { InjectedComponentProps } from 'khamsa';
import {
    FC,
    PropsWithChildren,
    useEffect,
    useState,
} from 'react';
import {
    NavLink,
    Outlet,
    useNavigate,
} from 'react-router-dom';
import { LocaleService } from '@modules/locale/locale.service';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { StyledEngineProvider } from '@mui/material/styles';
import styled from '@mui/material/styles/styled';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import {
    LocaleListItem,
    LocaleMenuProps,
} from '@modules/locale/locale.interface';
import { BrandService } from '@modules/brand/brand.service';
import { LocaleMenuComponent } from '@modules/locale/locale-menu.component';
import { ProfileMenuComponent } from '@modules/profile/profile-menu.component';
import { ClientsDropdownComponent } from '@modules/clients/clients-dropdown.component';
import { StoreService } from '@modules/store/store.service';
import { ClientsDropdownProps } from '@modules/clients/clients-dropdown.interface';
import shallow from 'zustand/shallow';
import { ContainerProps } from '@modules/container/container.interface';
import _ from 'lodash';
import { SnackbarProvider } from 'notistack';
import { ConfirmDialogProvider } from 'react-mui-confirm';
import Color from 'color';

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
                border-radius: 6px;
                pointer-events: none;
            }

            .wrapper {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding: 0 calc(${theme.spacing(1)} / 2);

                &.avatar-and-locales > * {
                    margin: 0 calc(${theme.spacing(1)} / 2);
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

const Container: FC<PropsWithChildren<InjectedComponentProps<ContainerProps>>> = ({
    declarations,
    onLocaleChange = _.noop,
}) => {
    const brandService = declarations.get<BrandService>(BrandService);
    const localeService = declarations.get<LocaleService>(LocaleService);
    const storeService = declarations.get<StoreService>(StoreService);
    const LocaleMenu = declarations.get<FC<LocaleMenuProps>>(LocaleMenuComponent);
    const ProfileMenu = declarations.get<FC>(ProfileMenuComponent);
    const ClientsDropdown = declarations.get<FC<ClientsDropdownProps>>(ClientsDropdownComponent);

    const theme = brandService.getTheme();

    const navigate = useNavigate();
    const [locales, setLocales] = useState<LocaleListItem[]>([]);
    const [locale, setLocale] = useState(localStorage.getItem('locale') || 'en_US');
    const [logo, setLogo] = useState<string>('');
    const getLocaleText = localeService.useLocaleContext();
    const {
        clientsDropdownOpen,
        switchClientsDropdownVisibility,
    } = storeService.useStore(
        (state) => {
            const {
                clientsDropdownOpen,
                switchClientsDropdownVisibility,
            } = state;
            return {
                clientsDropdownOpen,
                switchClientsDropdownVisibility,
            };
        },
        shallow,
    );
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
            setLogo(brandService.getLogo());
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
                                        component="img"
                                        src={logo}
                                    />
                                    <ClientsDropdown
                                        open={clientsDropdownOpen}
                                        onOpen={() => switchClientsDropdownVisibility(true)}
                                        onClose={() => switchClientsDropdownVisibility(false)}
                                    />
                                    <NavLink to="/explore" className="navlink">
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
                                    </NavLink>
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
                                        onClick={() => navigate('/clients/create')}
                                    >{getLocaleText('app.createClient')}</Button>
                                    <NavLink to="/settings" className="navlink">
                                        <IconButton>
                                            <Icon className="icon-settings" />
                                        </IconButton>
                                    </NavLink>
                                    <LocaleMenu
                                        locales={locales}
                                        selectedLocaleId={locale}
                                        onLocaleChange={(localeItem) => setLocale(localeItem.id)}
                                    />
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
};

export default Container;
