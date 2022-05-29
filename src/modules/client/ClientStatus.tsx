import Box from '@mui/material/Box';
import styled from '@mui/material/styles/styled';
import { InjectedComponentProps } from 'khamsa';
import {
    FC,
    useEffect,
    useRef,
    useState,
} from 'react';
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
import { SystemStatistic } from '@modules/client/client.interface';
import useTheme from '@mui/material/styles/useTheme';

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
        {
            title: 'dateRange.week',
            milliseconds: 7 * 24 * 60 * 60 * 1000,
        },
    ];

    const charts = [
        {
            title: 'chart.memoryUsage',
            pathname: 'mem',
            yAxis: 'used',
            yAxisFormatter: (value: string) => {
                return parseInt(value, 10) / (1000 * 1000 * 1000);
            },
            tooltipValueFormatter: (value: string) => {
                return `${parseInt(value, 10) / (1000 * 1000 * 1000)} GB`;
            },
        },
        {
            title: 'chart.swapMemoryUsage',
            pathname: 'mem',
            yAxis: 'swapused',
            yAxisFormatter: (value: string) => {
                return parseInt(value, 10) / (1000 * 1000 * 1000);
            },
            tooltipValueFormatter: (value: string) => {
                return `${parseInt(value, 10) / (1000 * 1000 * 1000)} GB`;
            },
        },
        {
            title: 'chart.cpuLoad',
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
            title: 'chart.disksIO',
            pathname: 'disksIO',
            yAxis: 'tIoSec',
            tooltipValueFormatter: (value: string) => {
                return `${value} time/second`;
            },
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
        const endDate = new Date();
        const { milliseconds } = dateRanges[dateRangeIndex];

        if (_.isNumber(milliseconds)) {
            const startTimestamp = endDate.getTime() - milliseconds;
            const startDate = new Date(startTimestamp);
            setDateRange([startDate, endDate]);
        }
    }, [dateRangeIndex]);

    useEffect(() => {
        if (getLocaleText !== _.noop && dateRange[0] !== null && dateRange[1] !== null) {
            Promise.all(charts.map((chart, index) => {
                return clientService.getSystemStatus({
                    clientId,
                    pathname: chart.pathname,
                    count: 20,
                    dateRange,
                });
            })).then((dataList) => {
                for (const [index, data] of dataList.entries()) {
                    const chartConfig = charts[index];

                    if (!chartConfig || !data?.response?.statistics || data.response.statistics.length === 0) {
                        continue;
                    }

                    const {
                        yAxis,
                        group,
                        yAxisFormatter,
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

                    const lineData = dataFormatter(data?.response?.statistics);
                    const chart = new Chart({
                        container: chartConfig.title,
                        autoFit: true,
                        height: 500,
                    });

                    chart.data(lineData);

                    chart.axis('created_at', {
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

                    chart.render();
                }
            }).catch(() => {}).finally(() => {});
        }
    }, [getLocaleText, dateRange]);

    return (
        <StyledBox>
            <Box className="header" ref={headerRef}>
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
            </Box>
            <SimpleBar
                style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: theme.spacing(2),
                    height: windowInnerHeight - appNavbarHeight - headerHeight,
                }}
            >
                {
                    charts.map((chartConfig, index) => {
                        return (
                            <Box id={chartConfig.title} key={index} />
                        );
                    })
                }
            </SimpleBar>
        </StyledBox>
    );
};

export default ClientStatus;
