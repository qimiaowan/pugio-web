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

const App: FC<PropsWithChildren<InjectedComponentProps>> = ({ declarations }) => {
    // eslint-disable-next-line no-unused-vars
    const [locale, setLocale] = useState(localStorage.getItem('locale') || 'en_US');

    const brandService = declarations.get<BrandService>(BrandService);
    const localeService = declarations.get<LocaleService>(LocaleService);
    const LocaleContext = localeService.getContext();

    const localeMap = localeService.useLocaleMap(locale);

    useEffect(() => {
        localStorage.setItem('locale', locale);
    }, [locale]);

    return (
        <LocaleContext.Provider value={localeMap}>
            {
                createElement(() => {
                    return (
                        <ThemeProvider theme={theme}>
                            <StyledEngineProvider injectFirst={true}>
                                <Box className="app-container">
                                    <Box className="navbar">
                                        <Box>
                                            <Box
                                                className="logo"
                                                component="img"
                                                src={brandService.getLogo()}
                                            />
                                        </Box>
                                        <Box></Box>
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
