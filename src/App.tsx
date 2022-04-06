import { InjectedComponentProps } from 'khamsa';
import {
    createElement,
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
import { StyledEngineProvider } from '@mui/material/styles';
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
import { ProfileMenuProps } from '@modules/profile/profile.interface';
import { ClientsDropdownComponent } from '@modules/clients/clients-dropdown.component';
import '@/app.component.less';

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
    },
});

const App: FC<PropsWithChildren<InjectedComponentProps>> = ({ declarations }) => {
    const [locales, setLocales] = useState<LocaleListItem[]>([]);
    const [locale, setLocale] = useState(localStorage.getItem('locale') || 'en_US');
    const [logo, setLogo] = useState<string>('');

    const brandService = declarations.get<BrandService>(BrandService);
    const localeService = declarations.get<LocaleService>(LocaleService);

    const LocaleMenu = declarations.get<FC<LocaleMenuProps>>(LocaleMenuComponent);
    const ProfileMenu = declarations.get<FC<ProfileMenuProps>>(ProfileMenuComponent);
    const ClientsDropdown = declarations.get<FC>(ClientsDropdownComponent);

    const LocaleContext = localeService.getContext();

    const localeMap = localeService.useLocaleMap(locale);

    useEffect(() => {
        localStorage.setItem('locale', locale);
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
        <LocaleContext.Provider value={localeMap}>
            {
                createElement(() => {
                    const getLocaleText = localeService.useLocaleContext();

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
                                            <ClientsDropdown />
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
                })
            }
        </LocaleContext.Provider>
    );
};

export default App;
