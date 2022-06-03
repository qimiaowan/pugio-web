import { getContainer } from 'khamsa';
import {
    FC,
    useEffect,
    useState,
} from 'react';
import { LocaleService } from '@modules/locale/locale.service';
import { ContainerComponent } from '@modules/container/container.component';
import { ContainerProps } from '@modules/container/container.interface';
import { AliveScope } from 'react-activation';
import { ListenerComponent } from '@modules/container/listener.component';

const App: FC = () => {
    const container = getContainer(App);
    const localeService = container.get<LocaleService>(LocaleService);
    const Container = container.get<FC<ContainerProps>>(ContainerComponent);
    const Listener = container.get<FC>(ListenerComponent);

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
