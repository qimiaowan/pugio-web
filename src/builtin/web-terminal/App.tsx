import {
    FC,
    useEffect,
    useRef,
    useState,
} from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import { InjectedComponentProps } from 'khamsa';
import { Context } from '@builtin:web-terminal/context';
import { LoadedChannelProps } from '@modules/store/store.interface';
import io, { Socket } from 'socket.io-client';
import { Terminal } from '@pugio/xterm';
import _ from 'lodash';
import { AppService } from '@builtin:web-terminal/app.service';
import { useAsyncEffect } from 'use-async-effect';
import { FitAddon } from 'xterm-addon-fit';
import { LocaleService } from '@modules/locale/locale.service';
import '@builtin:web-terminal/app.component.less';

const App: FC<InjectedComponentProps<LoadedChannelProps>> = (props) => {
    const {
        metadata,
        width,
        height,
        basename,
        declarations,
        tab,
        setup,
    } = props;

    const clientId = _.get(metadata, 'client.id');

    const appService = declarations.get<AppService>(AppService);
    const localeService = declarations.get<LocaleService>(LocaleService);

    const terminalRef = useRef<HTMLDivElement>(null);
    const [terminalId, setTerminalId] = useState<string>(null);
    const [client, setClient] = useState<Socket>(null);
    const getLocaleText = localeService.useLocaleContext('builtin.webTerminal');

    useAsyncEffect(async () => {
        if (terminalRef.current && terminalId && client) {
            const terminal = new Terminal();
            const xtermFitAddon = new FitAddon();
            terminal.loadAddon(xtermFitAddon);

            const clientDataHandler = (data) => {
                if (data?.content) {
                    terminal.sequenceWrite(
                        data,
                        (rawData: string) => {
                            return decodeURI(window.atob(rawData));
                        },
                        () => {
                            appService.sendConsumeConfirm({
                                clientId,
                                terminalId,
                                sequence: data?.sequence,
                            });
                        },
                    );
                }
            };

            const clientCloseHandler = () => {
                tab.closeTab();
                terminal.dispose();
                client.off(`terminal:${terminalId}:data`, clientDataHandler);
                client.off(`terminal:${terminalId}:close`, clientCloseHandler);
            };

            client.on(`terminal:${terminalId}:data`, clientDataHandler);
            client.on(`terminal:${terminalId}:close`, clientCloseHandler);

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
                client.off(`terminal:${terminalId}:data`, clientDataHandler);
                client.off(`terminal:${terminalId}:close`, clientCloseHandler);
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
        if (terminalId) {
            setup({
                onBeforeDestroy: () => {
                    appService.closeConnection({ clientId, terminalId });
                    return true;
                },
            });
        }
    }, [terminalId]);

    return (
        <Context.Provider
            value={{
                metadata,
                width,
                height,
                basename,
            }}
        >
            <Box className="container">
                <Box className="controls-wrapper">
                    <IconButton title={getLocaleText('reconnect')}>
                        <Icon className="icon-refresh" />
                    </IconButton>
                    <IconButton title={getLocaleText('clipboard')}>
                        <Icon className="icon-clipboard" />
                    </IconButton>
                    <Divider
                        variant="fullWidth"
                        orientation="vertical"
                        classes={{
                            root: 'divider',
                        }}
                    />
                    <IconButton title={getLocaleText('close')}>
                        <Icon className="icon-stop" />
                    </IconButton>
                </Box>
                <Box style={{ width }} className="terminal-wrapper" ref={terminalRef} />
            </Box>
        </Context.Provider>
    );
};

export default App;
