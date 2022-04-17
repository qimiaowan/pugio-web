import {
    App as KhamsaApp,
    router,
} from 'khamsa';
import { AppModule } from '@builtin:web-terminal/app.module';
import { ChannelMetadata } from '@modules/store/store.interface';
import { HashRouterProps } from 'react-router-dom';

export default (props: ChannelMetadata) => {
    return (
        <KhamsaApp
            module={AppModule}
            routerProps={{
                basename: `${props.location.pathname}/__channel__/pugio.web-terminal`,
            } as HashRouterProps}
            RouterComponent={router.HashRouter}
        />
    );
};
