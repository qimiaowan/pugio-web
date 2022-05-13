import { InjectedComponentProps } from 'khamsa';
import {
    FC,
    PropsWithChildren,
    useEffect,
    useState,
} from 'react';
import { LocaleService } from '@modules/locale/locale.service';
import { ContainerComponent } from '@modules/container/container.component';
import { ContainerProps } from '@modules/container/container.interface';
import { AliveScope } from 'react-activation';
import { ListenerComponent } from '@modules/container/listener.component';

const App: FC<PropsWithChildren<InjectedComponentProps>> = ({ declarations }) => {
    const localeService = declarations.get<LocaleService>(LocaleService);
    const Container = declarations.get<FC<ContainerProps>>(ContainerComponent);
    const Listener = declarations.get<FC>(ListenerComponent);

    const [locale, setLocale] = useState(localStorage.getItem('locale') || 'en_US');
    const localeMap = localeService.useLocaleMap(locale);

    const LocaleContext = localeService.getContext();

    useEffect(() => {
        localStorage.setItem('locale', locale);
    }, [locale]);

    return (
        <>
            <AliveScope>
                <LocaleContext.Provider
                    value={{
                        locale,
                        localeTextMap: localeMap,
                    }}
                >
                    <Container onLocaleChange={(locale) => setLocale(locale)} />
                </LocaleContext.Provider>
            </AliveScope>
            <Listener />
        </>
    );
};

export default App;
