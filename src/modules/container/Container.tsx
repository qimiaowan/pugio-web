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
} from 'react-router-dom';
import { LocaleService } from '@modules/locale/locale.service';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import {
    StyledEngineProvider,
    ThemeOptions,
} from '@mui/material/styles';
import createTheme from '@mui/material/styles/createTheme';
import theme from '@lenconda/shuffle-mui-theme';
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
import '@/app.component.less';
import { StoreService } from '@modules/store/store.service';
import { ClientsDropdownProps } from '@modules/clients/clients-dropdown.interface';
import shallow from 'zustand/shallow';
import { ContainerProps } from './container.interface';
import _ from 'lodash';

const pugioTheme = createTheme(theme, {
    components: {
        MuiIcon: {
            defaultProps: {
                baseClassName: 'pugio-icons',
            },
            styleOverrides: {
                root: {
                    width: 'initial',
                    height: 'initial',
                    fontSize: 12,
                },
                fontSizeSmall: {
                    fontSize: 6,
                },
                fontSizeLarge: {
                    fontSize: 16,
                },
            },
        },
        MuiListItemText: {
            defaultProps: {
                disableTypography: true,
            },
            styleOverrides: {
                root: {
                    fontSize: 13,
                },
            },
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    minWidth: 24,
                },
            },
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    userSelect: 'none',
                    cursor: 'pointer',
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                InputProps: {
                    classes: {
                        input: 'input',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                sizeMedium: {
                    fontSize: 12,
                    lineHeight: '17px',
                    paddingTop: 7,
                    paddingRight: 10,
                    paddingBottom: 7,
                    paddingLeft: 10,
                },
                sizeSmall: {
                    fontSize: 6,
                    lineHeight: '6px',
                    paddingTop: 7,
                    paddingRight: 10,
                    paddingBottom: 7,
                    paddingLeft: 10,
                },
                sizeLarge: {
                    fontSize: 14,
                    paddingTop: 7,
                    paddingRight: 10,
                    paddingBottom: 7,
                    paddingLeft: 10,
                },
                iconSizeMedium: {
                    '.pugio-icons': {
                        fontSize: 12,
                    },
                },
                iconSizeSmall: {
                    '.pugio-icons': {
                        fontSize: 6,
                        lineHeight: '10px',
                    },
                },
                iconSizeLarge: {
                    '.pugio-icons': {
                        fontSize: 16,
                    },
                },
            },
        },
    },
} as ThemeOptions);

const Container: FC<PropsWithChildren<InjectedComponentProps<ContainerProps>>> = ({
    declarations,
    onLocaleChange = _.noop,
}) => {
    const [locales, setLocales] = useState<LocaleListItem[]>([]);
    const [locale, setLocale] = useState(localStorage.getItem('locale') || 'en_US');
    const [logo, setLogo] = useState<string>('');

    const brandService = declarations.get<BrandService>(BrandService);
    const localeService = declarations.get<LocaleService>(LocaleService);
    const storeService = declarations.get<StoreService>(StoreService);
    const LocaleMenu = declarations.get<FC<LocaleMenuProps>>(LocaleMenuComponent);
    const ProfileMenu = declarations.get<FC>(ProfileMenuComponent);
    const ClientsDropdown = declarations.get<FC<ClientsDropdownProps>>(ClientsDropdownComponent);

    const getLocaleText = localeService.useLocaleContext();

    const [
        clientsDropdownOpen,
        switchClientsDropdownVisibility,
    ] = storeService.useStore(
        (state) => {
            return [state.clientsDropdownOpen, state.switchClientsDropdownVisibility];
        },
        shallow,
    );

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
        <ThemeProvider theme={pugioTheme}>
            <StyledEngineProvider injectFirst={true}>
                <Box className="app-container">
                    <Box className="navbar">
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
                            <NavLink to="/marketplace" className="navlink">
                                {
                                    <Button
                                        classes={{
                                            root: 'link',
                                        }}
                                    >{getLocaleText('app.navbar.marketplace')}</Button>
                                }
                            </NavLink>
                        </Box>
                        <Box className="wrapper avatar-and-locales">
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
                </Box>
            </StyledEngineProvider>
        </ThemeProvider>
    );
};

export default Container;
