import { InjectedComponentProps } from 'khamsa';
import {
    FC,
    PropsWithChildren,
    useEffect,
    useState,
} from 'react';
import { LocaleService } from '@modules/locale/locale.service';
import { BrandService } from '@modules/brand/brand.service';
import '@/app.component.less';
import { ContainerComponent } from '@modules/container/container.component';
import { ContainerProps } from '@modules/container/container.interface';

const App: FC<PropsWithChildren<InjectedComponentProps>> = ({ declarations }) => {
    const [locale, setLocale] = useState(localStorage.getItem('locale') || 'en_US');
    const [logo, setLogo] = useState<string>('');

    const brandService = declarations.get<BrandService>(BrandService);
    const localeService = declarations.get<LocaleService>(LocaleService);
    const Container = declarations.get<FC<ContainerProps>>(ContainerComponent);

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

    return (
        <LocaleContext.Provider value={localeMap}>
            <Container onLocaleChange={(locale) => setLocale(locale)} />
        </LocaleContext.Provider>
    );
};

export default App;
