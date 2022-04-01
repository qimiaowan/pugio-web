import { InjectedComponentProps } from 'khamsa';
import {
    createElement,
    FC,
    PropsWithChildren,
    useEffect,
    useState,
} from 'react';
import './App.less';
import { LocaleService } from './modules/locale/locale.service';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { StyledEngineProvider } from '@mui/material/styles';
import theme from '@lenconda/shuffle-mui-theme';
import Box from '@mui/material/Box';
import { BrandService } from './modules/brand/brand.service';
import {
    LocaleListItem,
    LocaleMenuProps,
} from './modules/locale/locale.interface';
import { LocaleMenuComponent } from './modules/locale/locale-menu.component';

const App: FC<PropsWithChildren<InjectedComponentProps>> = ({ declarations }) => {
    const [locales, setLocales] = useState<LocaleListItem[]>([]);
    const [locale, setLocale] = useState(localStorage.getItem('locale') || 'en_US');
    const [logo, setLogo] = useState<string>('');

    const brandService = declarations.get<BrandService>(BrandService);
    const localeService = declarations.get<LocaleService>(LocaleService);
    const LocaleMenu = declarations.get<FC<LocaleMenuProps>>(LocaleMenuComponent);

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
                    return (
                        <ThemeProvider theme={theme}>
                            <StyledEngineProvider injectFirst={true}>
                                <Box className="app-container">
                                    <Box className="navbar">
                                        <Box className="wrapper logo-and-nav">
                                            <Box
                                                className="logo"
                                                component="img"
                                                src={logo}
                                            />
                                        </Box>
                                        <Box className="wrapper avatar-and-locales">
                                            <LocaleMenu
                                                locales={locales}
                                                selectedLocaleId={locale}
                                                onLocaleChange={(localeItem) => setLocale(localeItem.id)}
                                            />
                                        </Box>
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
