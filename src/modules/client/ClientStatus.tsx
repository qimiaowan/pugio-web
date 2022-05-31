/* eslint-disable no-unused-vars */
import Box from '@mui/material/Box';
import styled from '@mui/material/styles/styled';
import { InjectedComponentProps } from 'khamsa';
import {
    FC,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
// import { ExceptionComponent } from '@modules/brand/exception.component';
import { LocaleService } from '@modules/locale/locale.service';
// import { ExceptionProps } from '@modules/brand/exception.interface';
import { useParams } from 'react-router-dom';
import { StoreService } from '@modules/store/store.service';
import _ from 'lodash';
import SimpleBar from 'simplebar-react';
import { ClientService } from '@modules/client/client.service';
import { Chart } from '@antv/g2';
import {
    GetSystemStatusResponseData,
    SystemStatistic,
} from '@modules/client/client.interface';
import useTheme from '@mui/material/styles/useTheme';
import { ChartConfigItem } from '@modules/client/client-status.interface';

const StyledBox = styled(Box)(({ theme }) => {
    return `
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;

        &.exception {
            justify-content: center;
            align-items: center;
        }

        .header {
            width: 100%;
            box-sizing: border-box;
            padding: ${theme.spacing(2)};
            display: flex;
            justify-content: space-between;
            align-items: center;

            .left-wrapper {
                & > * {
                    margin-right: ${theme.spacing(1)};
                }
            }
        }
    `;
});

const ClientStatus: FC<InjectedComponentProps> = ({
    declarations,
}) => {
    const dateRanges = [
        {
            title: 'dateRange.halfHour',
            milliseconds: 30 * 60 * 1000,
        },
        {
            title: 'dateRange.hour',
            milliseconds: 60 * 60 * 1000,
        },
        {
            title: 'dateRange.day',
            milliseconds: 24 * 60 * 60 * 1000,
        },
    ];

    // const Exception = declarations.get<FC<ExceptionProps>>(ExceptionComponent);
    const localeService = declarations.get<LocaleService>(LocaleService);
    const storeService = declarations.get<StoreService>(StoreService);
    const clientService = declarations.get<ClientService>(ClientService);

    const theme = useTheme();
    const headerRef = useRef<HTMLDivElement>(null);
    const { client_id: clientId } = useParams();
    const getLocaleText = localeService.useLocaleContext('pages.clientStatus');
    const [dateRangeIndex, setDateRangeIndex] = useState<number>(0);
    const [dateRange, setDateRange] = useState<[Date, Date]>([null, null]);
    const {
        appNavbarHeight,
        windowInnerHeight,
    } = storeService.useStore((state) => {
        const {
            appNavbarHeight,
            windowInnerHeight,
        } = state;

        return {
            appNavbarHeight,
            windowInnerHeight,
        };
    });
    const [headerHeight, setHeaderHeight] = useState<number>(0);
    const [chartContainers, setChartContainers] = useState<HTMLDivElement[]>([]);
    const [charts, setCharts] = useState<Chart[]>([]);
    const [chartConfigList, setChartConfigList] = useState<ChartConfigItem[]>([]);
    const [systemStatusDataList, setSystemStatusDataList] = useState<GetSystemStatusResponseData[]>([]);
    const [chartsLoading, setChartsLoading] = useState<boolean>(false);
    const [chartsErrored, setChartsErrored] = useState<boolean>(false);

    const handleSetChartContainer = useCallback((index: number, container: HTMLDivElement) => {
        if (!container) {
            return;
        }

        const currentChartContainers = Array.from(chartContainers);

        if (!currentChartContainers[index]) {
            currentChartContainers[index] = container;
            setChartContainers(currentChartContainers);
        }
    }, [chartContainers]);

    const handleLoadDataList = useCallback(() => {
        if (
            dateRange[0] !== null &&
            dateRange[1] !== null &&
            chartConfigList.length > 0 &&
            chartConfigList.length === charts.length &&
            charts.every((chart) => Boolean(chart))
        ) {
            setChartsLoading(true);
            setChartsErrored(false);
            Promise.all(chartConfigList.map((chart) => {
                return clientService.getSystemStatus({
                    clientId,
                    pathname: chart.pathname,
                    count: 20,
                    dateRange,
                });
            })).then((dataList) => {
                setSystemStatusDataList(dataList.map((dataListItem) => dataListItem?.response));
            }).catch(() => {
                setChartsErrored(true);
            }).finally(() => {
                setChartsLoading(false);
            });
        }
    }, [
        chartConfigList,
        charts,
        dateRange,
    ]);

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            const [observationData] = entries;

            if (observationData) {
                const blockSize = _.get(observationData, 'borderBoxSize[0].blockSize');

                if (_.isNumber(blockSize)) {
                    setHeaderHeight(blockSize);
                }
            }
        });

        if (headerRef.current) {
            observer.observe(headerRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [headerRef]);

    useEffect(() => {
        if (chartConfigList.length > 0) {
            setChartContainers(chartConfigList.map(() => null));
        }
    }, [chartConfigList]);

    useEffect(() => {
        if (getLocaleText !== _.noop) {
            setChartConfigList([
                {
                    title: getLocaleText('chart.memoryUsage'),
                    pathname: 'mem',
                    yAxis: 'used',
                    group: 'type',
                    yAxisFormatter: (value: string) => {
                        return parseInt(value, 10) / (1000 * 1000 * 1000);
                    },
                    tooltipValueFormatter: (value: string) => {
                        return `${parseInt(value, 10) / (1000 * 1000 * 1000)} GB`;
                    },
                    dataFormatter: (statistics: SystemStatistic[]) => {
                        return statistics.reduce((result, statistic) => {
                            const {
                                data,
                                createdAt,
                                updatedAt,
                            } = statistic;
                            const {
                                used,
                                swapused,
                            } = data;

                            return result.concat({
                                used,
                                type: getLocaleText('chart.memUsage.mem'),
                                createdAt,
                                updatedAt,
                            }).concat({
                                used: swapused,
                                type: getLocaleText('chart.memUsage.swapmem'),
                                createdAt,
                                updatedAt,
                            });
                        }, [] as Record<string, any>);
                    },
                },
                {
                    title: getLocaleText('chart.cpuLoad'),
                    pathname: 'currentLoad.cpus',
                    yAxis: 'load',
                    group: 'cpuName',
                    dataFormatter: (statistics: SystemStatistic[]) => {
                        return statistics.reduce((result, statistic) => {
                            const {
                                data,
                                createdAt,
                                updatedAt,
                            } = statistic;

                            if (_.isArray(data)) {
                                const currentStatisticItems = data.map((dataItem, index) => {
                                    return {
                                        ...dataItem,
                                        createdAt,
                                        updatedAt,
                                        cpuName: `CPU ${index + 1}`,
                                    };
                                });

                                return result.concat(currentStatisticItems);
                            } else {
                                return result.concat({
                                    ...data,
                                    cpuName: 'CPU 1',
                                    createdAt,
                                    updatedAt,
                                });
                            };
                        }, [] as Record<string, any>[]);
                    },
                    tooltipValueFormatter: (value: string) => {
                        return `${value}%`;
                    },
                },
                {
                    title: getLocaleText('chart.disksIO'),
                    pathname: 'disksIO',
                    yAxis: 'tIoSec',
                    tooltipValueFormatter: (value: string) => {
                        return `${value} time/second`;
                    },
                },
            ]);
        }
    }, [getLocaleText]);

    useEffect(() => {
        const endDate = new Date();
        const { milliseconds } = dateRanges[dateRangeIndex];

        if (_.isNumber(milliseconds)) {
            const startTimestamp = endDate.getTime() - milliseconds;
            const startDate = new Date(startTimestamp);
            setDateRange([startDate, endDate]);
        }
    }, [dateRangeIndex]);

    useEffect(() => {
        if (
            getLocaleText !== _.noop &&
            charts.length === chartConfigList.length &&
            charts.length === systemStatusDataList.length
        ) {
            for (const [index, data] of systemStatusDataList.entries()) {
                const chartConfig = chartConfigList[index];

                if (!chartConfig || !data?.statistics || data.statistics.length === 0) {
                    continue;
                }

                const {
                    title,
                    yAxis,
                    group,
                    yAxisFormatter,
                    tooltipValueFormatter = (value: string) => value,
                    dataFormatter = (statistics: SystemStatistic[]) => {
                        return statistics.map((statistic) => {
                            const {
                                data = {},
                                createdAt,
                                updatedAt,
                            } = statistic;

                            return {
                                ...data,
                                createdAt,
                                updatedAt,
                            };
                        });
                    },
                } = chartConfig;

                if (!yAxis) {
                    continue;
                }

                const lineData = dataFormatter(data?.statistics);
                const chart = charts[index];

                if (!chart) {
                    continue;
                }

                chart.data(lineData);

                chart.axis('createdAt', {
                    label: {
                        formatter: (value) => {
                            const date = new Date(value);
                            const hour = date.getHours();
                            const minute = date.getMinutes().toString().length === 1
                                ? `0${date.getMinutes().toString()}`
                                : date.getMinutes().toString();
                            return `${hour}:${minute}`;
                        },
                    },
                });

                const lineConfig = chart.line()
                    .position(`createdAt*${yAxis}`)
                    .shape('split-line');

                if (group) {
                    lineConfig.color(group);
                }

                if (_.isFunction(yAxisFormatter)) {
                    chart.axis(yAxis, {
                        label: {
                            formatter: yAxisFormatter,
                        },
                    });
                }

                lineConfig.tooltip(`createdAt*${yAxis}`, (name, value) => {
                    const date = new Date(name);
                    const year = date.getFullYear();
                    const month = date.getMonth();
                    const day = date.getDate();
                    const hour = date.getHours();
                    const minute = date.getMinutes().toString().length === 1
                        ? `0${date.getMinutes().toString()}`
                        : date.getMinutes().toString();

                    return {
                        title: getLocaleText(title),
                        name: `${year}-${month + 1}-${day} ${hour}:${minute}`,
                        value: tooltipValueFormatter(value),
                    };
                });

                chart.render();
            }

            return () => {
                charts.forEach((chart) => {
                    if (chart) {
                        chart.clear();
                    }
                });
            };
        }
    }, [
        getLocaleText,
        charts,
        systemStatusDataList,
    ]);

    useEffect(
        handleLoadDataList,
        [
            chartConfigList,
            charts,
            dateRange,
        ],
    );

    useEffect(() => {
        if (chartContainers.every((chartContainer) => Boolean(chartContainer))) {
            setCharts(chartConfigList.map((chartConfig, index) => {
                return new Chart({
                    container: chartContainers[index],
                    autoFit: true,
                    height: 360,
                });
            }));
        }
    }, [chartContainers]);

    useEffect(() => {
        if (!chartsLoading) {
            const intervalId = setInterval(handleLoadDataList, 60000);
            return () => clearInterval(intervalId);
        }
    }, [chartsLoading]);

    return (
        <StyledBox>
            <Box className="header" ref={headerRef}>
                <Box className="left-wrapper">
                    <ToggleButtonGroup value={dateRangeIndex}>
                        {
                            dateRanges.map((dateRangeItem, index) => {
                                return (
                                    <ToggleButton
                                        key={index}
                                        value={index}
                                        onClick={() => setDateRangeIndex(index)}
                                    >{getLocaleText(dateRangeItem.title)}</ToggleButton>
                                );
                            })
                        }
                    </ToggleButtonGroup>
                    <Button
                        variant="text"
                        color="primary"
                        startIcon={<Icon className="icon-refresh" />}
                        disabled={chartsLoading}
                        onClick={handleLoadDataList}
                    >{getLocaleText('refresh')}</Button>
                </Box>
            </Box>
            <SimpleBar
                style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: theme.spacing(3),
                    height: windowInnerHeight - appNavbarHeight - headerHeight,
                }}
            >
                {
                    chartConfigList.map((chartConfig, index) => {
                        return (
                            <Box
                                key={index}
                                id={chartConfig.title}
                                ref={(ref) => {
                                    if (ref) {
                                        handleSetChartContainer(index, ref as unknown as HTMLDivElement);
                                    }
                                }}
                            />
                        );
                    })
                }
            </SimpleBar>
        </StyledBox>
    );
};

export default ClientStatus;
