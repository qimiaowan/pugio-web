import { InjectedComponentProps } from 'khamsa';
import {
    createElement,
    FC,
    PropsWithChildren,
} from 'react';
import './App.less';
import { LocaleService } from './modules/locale/locale.service';

const App: FC<PropsWithChildren<InjectedComponentProps>> = ({ declarations }) => {
    const localeService = declarations.get<LocaleService>(LocaleService);
    const LocaleContext = localeService.getContext();

    const localeMap = localeService.useLocaleMap('zh_CN');

    return (
        <LocaleContext.Provider value={localeMap}>
            {
                createElement(() => {
                    const getLocaleText = localeService.useLocaleContext();

                    return (
                        <div className="App">
                            <header className="App-header">
                                <p>Edit <code>src/App.tsx</code> and save to reload.</p>
                                <a
                                    className="App-link"
                                    href="https://reactjs.org"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >Learn React</a>
                                <p>{getLocaleText('app.menu.apps')}</p>
                            </header>
                        </div>
                    );
                })
            }
        </LocaleContext.Provider>
    );
};

export default App;
