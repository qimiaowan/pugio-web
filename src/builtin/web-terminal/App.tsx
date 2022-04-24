/* eslint-disable no-unused-vars */
import {
    FC,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import Box, { BoxProps } from '@mui/material/Box';
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
import { LoadingComponent } from '@modules/brand/loading.component';
import SimpleBar from 'simplebar-react';
import clsx from 'clsx';

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
    const Loading = declarations.get<FC<BoxProps>>(LoadingComponent);

    const terminalRef = useRef<HTMLDivElement>(null);
    const [terminalId, setTerminalId] = useState<string>(null);
    const [client, setClient] = useState<Socket>(null);
    const getLocaleText = localeService.useLocaleContext('builtin.webTerminal');
    const [loading, setLoading] = useState<boolean>(false);
    const [closeConnectionLoading, setCloseConnectionLoading] = useState<boolean>(false);
    const [terminal, setTerminal] = useState<Terminal<Record<string, any>>>(null);
    const [headerControlItems, setHeaderControlItems] = useState<HeaderControlItem[]>([]);
    const [cleanConnection, setCleanConnection] = useState<Function>(() => _.noop);

    const handleCloseConnection = useCallback((clientId: string, terminalId: string) => {
        if (terminal) {
            setCloseConnectionLoading(true);
            appService.closeConnection({ clientId, terminalId }).then((response) => {
                if (response?.response?.data?.accepted) {
                    cleanConnection();
                }
            }).finally(() => setCloseConnectionLoading(false));
        }
    }, [terminal, cleanConnection]);

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
                terminal.dispose();
                client.off(`terminal:${terminalId}:data`, clientDataHandler);
                client.off(`terminal:${terminalId}:close`, clientCloseHandler);
                tab.closeTab();
            };

            setCleanConnection(() => clientCloseHandler);

            client.on(`terminal:${terminalId}:data`, clientDataHandler);
            client.on(`terminal:${terminalId}:close`, clientCloseHandler);

            terminal.open(terminalRef.current);
            xtermFitAddon.fit();

            setTerminal(terminal);

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

    useEffect(() => {
        if (terminal && terminalId) {
            setHeaderControlItems([
                {
                    button: {
                        icon: 'icon-refresh',
                        props: {
                            disabled: loading || closeConnectionLoading,
                            title: getLocaleText('reconnect'),
                        },
                    },
                },
                {
                    button: {
                        icon: 'icon-clipboard',
                        props: {
                            disabled: loading || closeConnectionLoading,
                            title: getLocaleText('clipboard'),
                        },
                    },
                },
                {
                    divider: true,
                },
                {
                    button: {
                        icon: 'icon-stop',
                        props: {
                            disabled: loading || closeConnectionLoading,
                            title: getLocaleText('close'),
                            onClick: () => handleCloseConnection(clientId, terminalId),
                        },
                    },
                },
            ]);
        }
    }, [
        terminalId,
        terminal,
        client,
        getLocaleText,
        loading,
        closeConnectionLoading,
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
            <Box className={clsx('container', { loading })}>
                <SimpleBar style={{ width }} className="controls-wrapper">
                    {
                        headerControlItems.map((item, index) => {
                            const {
                                button,
                                divider,
                            } = item;

                            if (button) {
                                const {
                                    icon,
                                    props = {},
                                } = button;

                                return (
                                    <IconButton key={index} {...props} >
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
                {
                    loading && (
                        <Box className="loading-wrapper">
                            <Loading />
                        </Box>
                    )
                }
            </Box>
        </Context.Provider>
    );
};

export default App;
