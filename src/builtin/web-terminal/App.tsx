import {
    FC,
    useState,
} from 'react';
import Box from '@mui/material/Box';
import { InjectedComponentProps } from 'khamsa';
import { Context } from '@builtin:web-terminal/context';
import { LoadedChannelProps } from '@modules/store/store.interface';

const App: FC<InjectedComponentProps<LoadedChannelProps>> = (props) => {
    const {
        metadata,
        width,
        height,
        basename,
    } = props;

    const [count, setCount] = useState<number>(0);

    return (
        <Context.Provider
            value={{
                metadata,
                width,
                height,
                basename,
            }}
        >
            <Box
                style={{
                    width,
                }}
            >
                <h2>It works!</h2>
                <p>{count}</p>
                <button onClick={() => setCount(count + 1)}>TEST</button>
            </Box>
        </Context.Provider>
    );
};

export default App;
