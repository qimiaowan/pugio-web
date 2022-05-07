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
import { AliveScope } from 'react-activation';
import { ListenerComponent } from '@modules/container/listener.component';
import { SnackbarProvider } from 'notistack';

const App: FC<PropsWithChildren<InjectedComponentProps>> = ({ declarations }) => {
    const brandService = declarations.get<BrandService>(BrandService);
    const localeService = declarations.get<LocaleService>(LocaleService);
    const Container = declarations.get<FC<ContainerProps>>(ContainerComponent);
    const Listener = declarations.get<FC>(ListenerComponent);

    const [locale, setLocale] = useState(localStorage.getItem('locale') || 'en_US');
    const [logo, setLogo] = useState<string>('');

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
        <>
            <AliveScope>
                <LocaleContext.Provider
                    value={{
                        locale,
                        localeTextMap: localeMap,
                    }}
                >
                    <SnackbarProvider>
                        <Container onLocaleChange={(locale) => setLocale(locale)} />
                    </SnackbarProvider>
                </LocaleContext.Provider>
            </AliveScope>
            <Listener />
        </>
    );
};

export default App;
