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
import { LoadedChannelProps } from '@modules/store/store.interface';
import { Terminal } from '@pugio/xterm';
import _ from 'lodash';
import { AppService } from '@builtin:web-terminal/app.service';
import { useAsyncEffect } from 'use-async-effect';
import { FitAddon } from 'xterm-addon-fit';
import { LocaleService } from '@modules/locale/locale.service';
import '@builtin:web-terminal/app.component.less';
import { HeaderControlItem } from '@builtin:web-terminal/app.interface';
import { LoadingComponent } from '@modules/brand/loading.component';
import SimpleBar from 'simplebar-react';
import clsx from 'clsx';
import { useDebounceEffect } from 'ahooks';

const App: FC<InjectedComponentProps<LoadedChannelProps>> = (props) => {
    const {
        metadata,
        width,
        height,
        declarations,
        tab,
        setup,
    } = props;

    const clientId = _.get(metadata, 'client.id');
    const clipboardAvailable = _.isFunction(navigator?.clipboard?.read);

    const appService = declarations.get<AppService>(AppService);
    const localeService = declarations.get<LocaleService>(LocaleService);
    const Loading = declarations.get<FC<BoxProps>>(LoadingComponent);

    const terminalRef = useRef<HTMLDivElement>(null);
    const controlsWrapperRef = useRef<SimpleBar>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [terminalId, setTerminalId] = useState<string>(null);
    const [dataSocket, setDataSocket] = useState<WebSocket>(null);
    const getLocaleText = localeService.useLocaleContext('builtin.webTerminal');
    const [loading, setLoading] = useState<boolean>(false);
    const [closeConnectionLoading, setCloseConnectionLoading] = useState<boolean>(false);
    const [cleanConnectionLoading, setCleanConnectionLoading] = useState<boolean>(false);
    const [terminal, setTerminal] = useState<Terminal<Record<string, any>>>(null);
    const [headerControlItems, setHeaderControlItems] = useState<HeaderControlItem[]>([]);
    const [closeConnection, setCloseConnection] = useState<Function>(() => _.noop);
    const [cleanConnection, setCleanConnection] = useState<Function>(() => _.noop);
    const [terminalHeight, setTerminalHeight] = useState<number>(0);
    const [terminalWidth, setTerminalWidth] = useState<number>(0);
    const [terminalFitAddon, setTerminalFitAddon] = useState<FitAddon>(null);

    const calculateTerminalSize = (
        width: number,
        height: number,
        terminal: Terminal<Record<string, any>>,
    ) => {
        if (!width || !height || !terminal) {
            return {
                cols: 120,
                rows: 80,
            };
        }

        const terminalScrollBarWidth = _.get(terminal, '_core.viewport.scrollBarWidth') || 0;
        const terminalActualCellWidth = _.get(terminal, '_core._renderService._renderer.dimensions.actualCellWidth') || 0;
        const terminalActualCellHeight = _.get(terminal, '_core._renderService._renderer.dimensions.actualCellHeight') || 0;

        if (!terminalActualCellWidth || !terminalActualCellHeight) {
            return {
                cols: 120,
                rows: 80,
            };
        }

        let cols = 120;
        let rows = 80;

        if (terminalActualCellWidth) {
            cols = (width - terminalScrollBarWidth) / terminalActualCellWidth;
        }

        if (terminalActualCellHeight) {
            rows = height / terminalActualCellHeight - 1;
        }

        if (cols < 120) {
            cols = 120;
        }

        if (rows < 80) {
            rows = 80;
        }

        return {
            cols: Math.round(cols),
            rows: Math.round(rows),
        };
    };

    const handleCloseConnection = useCallback((clientId: string, terminalId: string) => {
        if (terminal) {
            setCloseConnectionLoading(true);
            appService.closeConnection({ clientId, terminalId }).then((response) => {
                if (response?.response?.data?.accepted) {
                    closeConnection();
                }
            }).finally(() => setCloseConnectionLoading(false));
        }
    }, [terminal, closeConnection]);

    const handleReconnect = useCallback((clientId: string, terminalId: string) => {
        setCleanConnectionLoading(true);
        appService.closeConnection({ clientId, terminalId })
            .catch(() => {})
            .finally(() => {
                cleanConnection();
                setTerminal(null);
                setTerminalId(null);
                setCleanConnectionLoading(false);
            });
    }, [terminal, cleanConnection]);

    useAsyncEffect(async () => {
        if (terminalRef.current && terminalId && terminalHeight > 0) {
            const dataSocket = new WebSocket(`wss://pugio.lenconda.top/websocket?auth_type=bearer&auth_token=${localStorage.getItem('ACCESS_TOKEN')}&event=terminal:${terminalId}:recv_data&broadcast[]=terminal:${terminalId}:send_data&room=${clientId}`);
            const closeSocket = new WebSocket(`wss://pugio.lenconda.top/websocket?auth_type=bearer&auth_token=${localStorage.getItem('ACCESS_TOKEN')}&event=terminal:${terminalId}:close&broadcast[]=terminal:${terminalId}:close&room=${clientId}`);

            setDataSocket(dataSocket);

            const terminal = new Terminal({
                scrollback: 0,
            });
            const xtermFitAddon = new FitAddon();
            terminal.loadAddon(xtermFitAddon);

            const clientDataHandler = (event: MessageEvent<any>) => {
                if (event?.data) {
                    terminal.write(decodeURI(event.data));
                }
            };

            const clientCloseHandler = () => {
                terminal.dispose();
                dataSocket.removeEventListener('message', clientDataHandler);
                closeSocket.removeEventListener('message', clientCloseHandler);
                tab.closeTab();

                if (dataSocket) {
                    dataSocket.close();
                }

                if (closeSocket) {
                    closeSocket.close();
                }
            };

            const handleCleanClientListeners = () => {
                dataSocket.removeEventListener('message', clientDataHandler);
                closeSocket.removeEventListener('message', clientCloseHandler);
            };

            setCloseConnection(() => clientCloseHandler);
            setCleanConnection(() => () => {
                terminal.dispose();
                handleCleanClientListeners();
            });

            dataSocket.addEventListener('message', clientDataHandler);
            closeSocket.addEventListener('message', clientCloseHandler);

            terminal.open(terminalRef.current);
            xtermFitAddon.fit();

            setTerminal(terminal);

            const listener = terminal.onData((data) => {
                dataSocket.send(encodeURI(data));
            });

            const connectionResponse = await appService.connect({
                clientId,
                terminalId,
                ...calculateTerminalSize(width, height, terminal),
            });

            const initialContent = connectionResponse?.response?.data?.content || [];
            terminal.initialize(initialContent);

            setLoading(false);
            setTerminalFitAddon(xtermFitAddon);

            return () => {
                listener.dispose();
                handleCleanClientListeners();
            };
        }
    }, [terminalRef.current, terminalId]);

    useEffect(() => {
        if (!terminalId) {
            setLoading(true);
            appService.makeHandshake({ clientId }).then((response) => {
                setTerminalId(response?.response?.data?.id);
            });
        } else {
            setup({
                onBeforeDestroy: () => {
                    closeConnection();
                    appService.closeConnection({ clientId, terminalId });
                    return true;
                },
            });
        }
    }, [terminalId, closeConnection]);

    useEffect(() => {
        if (terminal && terminalId) {
            setHeaderControlItems([
                {
                    button: {
                        icon: 'icon-refresh',
                        props: {
                            disabled: loading || closeConnectionLoading || cleanConnectionLoading,
                            title: getLocaleText('reconnect'),
                            onClick: () => handleReconnect(clientId, terminalId),
                        },
                    },
                },
                {
                    button: {
                        icon: 'icon-clipboard',
                        props: {
                            disabled: loading ||
                                closeConnectionLoading ||
                                cleanConnectionLoading ||
                                !clipboardAvailable ||
                                !dataSocket,
                            title: getLocaleText('clipboard'),
                            onClick: () => {
                                navigator.clipboard.readText().then((data) => {
                                    if (data) {
                                        dataSocket.send(window.btoa(encodeURI(data)));
                                    }
                                });
                            },
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
                            disabled: loading || closeConnectionLoading || cleanConnectionLoading,
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
        dataSocket,
        getLocaleText,
        loading,
        closeConnectionLoading,
        cleanConnectionLoading,
        clipboardAvailable,
    ]);

    useDebounceEffect(
        () => {
            if (terminalId && terminal && terminalHeight && terminalWidth && terminalFitAddon) {
                const {
                    cols,
                    rows,
                } = calculateTerminalSize(terminalWidth, terminalHeight, terminal);
                terminal.resize(cols, rows);
                appService.resize({
                    clientId,
                    terminalId,
                    cols,
                    rows,
                });
                terminalFitAddon.fit();
            }
        },
        [
            terminalId,
            terminal,
            terminalHeight,
            terminalWidth,
            terminalFitAddon,
        ],
        {
            wait: 300,
        },
    );

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            const [observationData] = entries;

            if (observationData && controlsWrapperRef.current) {
                const width = _.get(observationData, 'borderBoxSize[0].inlineSize');
                const height = _.get(observationData, 'borderBoxSize[0].blockSize');

                setTerminalWidth(width);
                setTerminalHeight(height - controlsWrapperRef.current?.el?.clientHeight || 0);
            }
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [containerRef.current, controlsWrapperRef.current]);

    return (
        <>
            <Box className={clsx('container', { loading })}>
                <SimpleBar style={{ width: terminalWidth }} className="controls-wrapper" ref={controlsWrapperRef}>
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
                <Box
                    className="terminal-wrapper"
                    style={{ width: terminalWidth, height: terminalHeight }}
                    ref={terminalRef}
                />
                {
                    loading && (
                        <Box className="loading-wrapper">
                            <Loading />
                        </Box>
                    )
                }
            </Box>
            <Box className="resize-detector" ref={containerRef} />
        </>
    );
};

export default App;
