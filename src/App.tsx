import { InjectedComponentProps } from 'khamsa';
import {
    FC,
    PropsWithChildren,
    useEffect,
    useState,
} from 'react';
import { LocaleService } from '@modules/locale/locale.service';
import { BrandService } from '@modules/brand/brand.service';
import { ContainerComponent } from '@modules/container/container.component';
import { ContainerProps } from '@modules/container/container.interface';
import {
    useLocation,
    useNavigate,
} from 'react-router-dom';
import { UtilsService } from '@modules/utils/utils.service';
import { StoreService } from '@modules/store/store.service';
import { AliveScope } from 'react-activation';
import shallow from 'zustand/shallow';

const App: FC<PropsWithChildren<InjectedComponentProps>> = ({ declarations }) => {
    const brandService = declarations.get<BrandService>(BrandService);
    const localeService = declarations.get<LocaleService>(LocaleService);
    const utilsService = declarations.get<UtilsService>(UtilsService);
    const storeService = declarations.get<StoreService>(StoreService);
    const Container = declarations.get<FC<ContainerProps>>(ContainerComponent);

    const [locale, setLocale] = useState(localStorage.getItem('locale') || 'en_US');
    const [logo, setLogo] = useState<string>('');
    const location = useLocation();
    const navigate = useNavigate();
    const [
        pathnameReady,
        setPathnameReady,
    ] = storeService.useStore((state) => {
        const {
            pathnameReady,
            setPathnameReady,
        } = state;
        return [pathnameReady, setPathnameReady];
    }, shallow);

    const LocaleContext = localeService.getContext();

    const localeMap = localeService.useLocaleMap(locale);

    useEffect(() => {
        localStorage.setItem('locale', locale);
    }, [locale]);

    useEffect(() => {
        if (!logo) {
            setLogo(brandService.getLogo());
        }
    }, [logo]);

    useEffect(() => {
        if (location && pathnameReady) {
            localStorage.setItem('app.pathname', utilsService.serializeLocation(location));
        }
    }, [location, pathnameReady]);

    useEffect(() => {
        const pathname = localStorage.getItem('app.pathname') || '';

        if (pathname && !pathnameReady) {
            navigate(pathname);
        }

        setPathnameReady();
    }, [pathnameReady]);

    return (
        <AliveScope>
            <LocaleContext.Provider value={localeMap}>
                <Container onLocaleChange={(locale) => setLocale(locale)} />
            </LocaleContext.Provider>
        </AliveScope>
    );
};

export default App;
