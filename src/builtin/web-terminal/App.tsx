/* eslint-disable no-unused-vars */
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
import { useRequest } from 'ahooks';
import { HeaderControlItem } from '@builtin:web-terminal/app.interface';
import SimpleBar from 'simplebar-react';

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
    const [loading, setLoading] = useState<boolean>(false);
    const {
        loading: closeConnectionLoading,
        run: closeConnection,
    } = useRequest(
        appService.closeConnection as typeof appService.closeConnection,
        {
            manual: true,
        },
    );
    const [disposeTerminal, setDisposeTerminal] = useState<Function>(null);
    const [headerControlItems, setHeaderControlItems] = useState<HeaderControlItem[]>([]);

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

            setDisposeTerminal(listener.dispose);

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

    useEffect(() => {
        setHeaderControlItems([
            {
                button: {
                    title: getLocaleText('reconnect'),
                    icon: 'icon-refresh',
                },
            },
            {
                button: {
                    icon: 'icon-clipboard',
                    title: getLocaleText('clipboard'),
                },
            },
            {
                divider: true,
            },
            {
                button: {
                    icon: 'icon-stop',
                    title: getLocaleText('close'),
                },
            },
        ]);
    }, [
        terminalId,
        disposeTerminal,
        client,
        getLocaleText,
    ]);

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
                <SimpleBar style={{ width }} className="controls-wrapper">
                    {
                        headerControlItems.map((item, index) => {
                            const {
                                button,
                                divider,
                            } = item;

                            if (button) {
                                const {
                                    title,
                                    icon,
                                    clickHandler = _.noop,
                                } = button;

                                return (
                                    <IconButton key={index} title={title} onClick={clickHandler} >
                                        <Icon className={icon} />
                                    </IconButton>
                                );
                            } else if (divider) {
                                return (
                                    <Divider
                                        key={index}
                                        variant="fullWidth"
                                        orientation="vertical"
                                        classes={{
                                            root: 'divider',
                                        }}
                                    />
                                );
                            } else {
                                return null;
                            }
                        })
                    }
                </SimpleBar>
                <Box style={{ width }} className="terminal-wrapper" ref={terminalRef} />
            </Box>
        </Context.Provider>
    );
};

export default App;
