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
// import ThemeProvider from '@mui/material/styles/ThemeProvider';
// import { StyledEngineProvider } from '@mui/material/styles';
// import theme from '@lenconda/shuffle-mui-theme';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { BrandService } from './modules/brand/brand.service';

const App: FC<PropsWithChildren<InjectedComponentProps>> = ({ declarations }) => {
    // eslint-disable-next-line no-unused-vars
    const [locale, setLocale] = useState(localStorage.getItem('locale') || 'en_US');

    const brandService = declarations.get<BrandService>(BrandService);
    const localeService = declarations.get<LocaleService>(LocaleService);
    const LocaleContext = localeService.getContext();

    const localeMap = localeService.useLocaleMap('en_US');

    useEffect(() => {
        localStorage.setItem('locale', locale);
    }, [locale]);

    useEffect(() => {
        console.log(localeService, brandService);
    }, [localeService, brandService]);

    return (
        <LocaleContext.Provider value={localeMap}>
            {
                createElement(() => {
                    // return (
                    //     <ThemeProvider theme={theme}>
                    //         <StyledEngineProvider injectFirst={true}>
                    //             <Box className="app-container">
                    //                 <Box className="navbar">
                    //                     <Box component="img" src={brandService.getLogo()} />
                    //                 </Box>
                    //                 <Button>asdasd</Button>
                    //             </Box>
                    //         </StyledEngineProvider>
                    //     </ThemeProvider>
                    // );
                    return (
                        <Box className="app-container">
                            <Box className="navbar">
                                <Box component="img" src={brandService.getLogo()} />
                            </Box>
                            <Button>asdasd</Button>
                        </Box>
                    );
                })
            }
        </LocaleContext.Provider>
    );
};

export default App;
