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
            lines: () => {
                return [
                    {
                        yAxis: 'used',
                        yAxisFormatter: (value: string) => {
                            return parseInt(value, 10) / (1000 * 1000 * 1000);
                        },
                        tooltipValueFormatter: (value: string) => {
                            return `${parseInt(value, 10) / (1000 * 1000 * 1000)} GB`;
                        },
                    },
                ];
            },
        },
        {
            title: 'chart.swapMemoryUsage',
            lines: () => {
                return [
                    {
                        yAxis: 'swapused',
                        yAxisFormatter: (value: string) => {
                            return parseInt(value, 10) / (1000 * 1000 * 1000);
                        },
                        tooltipValueFormatter: (value: string) => {
                            return `${parseInt(value, 10) / (1000 * 1000 * 1000)} GB`;
                        },
                    },
                ];
            },
        },
        {
            title: 'chart.cpuLoad',
            lines: (data) => {
                if (_.isArray(data)) {

                } else {
                    return [{
                        yAxis: 'load',
                        tooltipValueFormatter: (value: string) => {
                            return `${value}%`;
                        },
                    }];
                };
            },
            yAxis: 'load',
            tooltipValueFormatter: (value: string) => {
                return `${value}%`;
            },
        },
        {
            title: 'chart.disksIO',
        },
    ];

    // const Exception = declarations.get<FC<ExceptionProps>>(ExceptionComponent);
    const localeService = declarations.get<LocaleService>(LocaleService);
    const storeService = declarations.get<StoreService>(StoreService);

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
        const milliseconds = dateRanges[dateRangeIndex];

        if (_.isNumber(milliseconds)) {
            const startTimestamp = endDate.getTime() - milliseconds;
            const startDate = new Date(startTimestamp);
            setDateRange([startDate, endDate]);
        }
    }, [dateRangeIndex]);

    return (
        <StyledBox>
            <Box className="header" ref={headerRef}>
                <ToggleButtonGroup value={dateRangeIndex}>
                    {
                        dateRanges.map((dateRangeItem, index) => {
                            return (
                                <ToggleButton
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
                    height: windowInnerHeight - - appNavbarHeight * 2 - headerHeight,
                }}
            ></SimpleBar>
        </StyledBox>
    );
};

export default ClientStatus;
