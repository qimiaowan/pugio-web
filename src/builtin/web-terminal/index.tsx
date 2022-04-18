import {
    App as KhamsaApp,
    router,
} from 'khamsa';
import { AppModule } from '@builtin:web-terminal/app.module';
import { LoadedChannelProps } from '@modules/store/store.interface';
import { HashRouterProps } from 'react-router-dom';
import { Context } from '@builtin:web-terminal/context';

export default (props: LoadedChannelProps) => {
    const {
        basename,
    } = props;

    return (
        <Context.Provider value={props}>
            <KhamsaApp
                module={AppModule}
                routerProps={{ basename } as HashRouterProps}
                RouterComponent={router.HashRouter}
            />
        </Context.Provider>
    );
};
