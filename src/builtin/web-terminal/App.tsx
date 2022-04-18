import {
    FC,
    useContext,
} from 'react';
import Box from '@mui/material/Box';
import { InjectedComponentProps } from 'khamsa';
import { Context as OuterContext } from '@builtin:web-terminal/context';
import { ContextService } from '@builtin:web-terminal/modules/context/context.service';

const App: FC<InjectedComponentProps> = ({
    declarations,
}) => {
    const contextService = declarations.get<ContextService>(ContextService);

    const channelConfig = useContext(OuterContext);

    return (
        <contextService.Context.Provider value={channelConfig}>
            <Box></Box>
        </contextService.Context.Provider>
    );
};

export default App;
