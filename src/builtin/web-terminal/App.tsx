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
import { useAsyncEffect } from 'use-async-effect';
import { FitAddon } from 'xterm-addon-fit';

const App: FC<InjectedComponentProps<LoadedChannelProps>> = (props) => {
    const {
        metadata,
        width,
        height,
        basename,
        declarations,
        setup,
    } = props;

    const clientId = _.get(metadata, 'client.id');

    const appService = declarations.get<AppService>(AppService);

    const terminalRef = useRef<HTMLDivElement>(null);
    const [terminalId, setTerminalId] = useState<string>(null);
    const [client, setClient] = useState<Socket>(null);

    useAsyncEffect(async () => {
        if (terminalRef.current && terminalId && client) {
            const terminal = new Terminal();
            const xtermFitAddon = new FitAddon();
            terminal.loadAddon(xtermFitAddon);

            client.on(`terminal:${terminalId}:data`, (data) => {
                if (data?.content) {
                    terminal.sequenceWrite(data, (rawData: string) => {
                        return decodeURI(window.atob(rawData));
                    });
                }
            });

            client.on(`terminal:${terminalId}:close`, () => {
                terminal.dispose();
            });

            terminal.open(terminalRef.current);
            xtermFitAddon.fit();

            const listener = terminal.onSequenceData(async (data) => {
                const { sequence, content } = data as any;
                await appService.sendData({
                    clientId,
                    terminalId,
                    sequence,
                    terminalData: encodeURI(content),
                });
            });

            const connectionResponse = await appService.connect({
                clientId,
                terminalId,
            });

            const initialContent = connectionResponse?.response?.data?.content || [];
            terminal.initialize(initialContent);

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

    useEffect(() => {
        setup();
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
