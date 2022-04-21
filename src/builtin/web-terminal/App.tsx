/* eslint-disable no-unused-vars */
import {
    FC,
    useEffect,
    useRef,
    useState,
} from 'react';
import Box from '@mui/material/Box';
import { InjectedComponentProps } from 'khamsa';
import { Context } from '@builtin:web-terminal/context';
import { LoadedChannelProps } from '@modules/store/store.interface';
import io from 'socket.io-client';
import { Terminal } from '@pugio/xterm';
import _ from 'lodash';

const App: FC<InjectedComponentProps<LoadedChannelProps>> = (props) => {
    const {
        metadata,
        width,
        height,
        basename,
    } = props;

    const clientId = _.get(metadata, 'client.id');

    const terminalRef = useRef<HTMLDivElement>(null);
    const [terminal, setTerminal] = useState<Terminal<any>>(null);
    const [terminalId, setTerminalId] = useState<string>(null);

    useEffect(() => {
        if (terminalRef.current && terminal) {
            const client = io('/client');
            client.emit('join', clientId);
        }
    }, [terminalRef.current, terminal]);

    useEffect(() => {
        if (!terminalId) {
            // TODO
            console.log('connect');
            setTerminalId('asd');
        }
    }, [terminalId]);

    useEffect(() => {
        setTerminal(new Terminal());

        return () => {
            console.log('disconnect');
        };
    }, []);

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
                    height,
                }}
                ref={terminalRef}
            />
        </Context.Provider>
    );
};

export default App;
