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
import io, { Socket } from 'socket.io-client';
import { Terminal } from '@pugio/xterm';
import _ from 'lodash';
import { AppService } from '@builtin:web-terminal/app.service';

const App: FC<InjectedComponentProps<LoadedChannelProps>> = (props) => {
    const {
        metadata,
        width,
        height,
        basename,
        declarations,
    } = props;

    const clientId = _.get(metadata, 'client.id');

    const appService = declarations.get<AppService>(AppService);

    const terminalRef = useRef<HTMLDivElement>(null);
    const [terminalId, setTerminalId] = useState<string>(null);
    const [client, setClient] = useState<Socket>(null);

    useEffect(() => {
        if (terminalRef.current && terminalId && client) {
            const terminal = new Terminal();

            terminal.initialize([]);

            client.on(`terminal:${terminalId}:data`, (data) => {
                if (data?.content) {
                    terminal.sequenceWrite(data, (rawData) => {
                        return window.atob(rawData as string);
                    });
                }
            });

            client.on(`terminal:${terminalId}:close`, (data) => {
                terminal.dispose();
            });

            terminal.open(terminalRef.current);

            const listener = terminal.onSequenceData(async (data) => {
                const { sequence, content } = data as any;
                await appService.sendData({
                    clientId,
                    terminalId,
                    sequence,
                    terminalData: content,
                });
            });

            appService.connect({
                clientId,
                terminalId,
            }).then((response) => {
                // const content = response?.response?.data?.content || [];
                // terminal.initialize(content, (rawData) => window.atob(rawData as string));
            });

            return () => {
                listener.dispose();
            };
        }
    }, [terminalRef.current, client, terminalId]);

    useEffect(() => {
        if (!terminalId) {
            appService.makeHandshake({ clientId }).then((response) => {
                setTerminalId(response?.response?.data?.id);
            });
        }
    }, [terminalId]);

    useEffect(() => {
        const client = io('/client');
        client.emit('join', clientId);
        setClient(client);
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
