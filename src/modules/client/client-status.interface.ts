import { SystemStatistic } from '@modules/client/client.interface';

export interface ChartConfigItem {
    title: string;
    pathname: string;
    yAxis: string;
    group?: string;
    yAxisFormatter?: (value: string) => any;
    tooltipValueFormatter?: (value: string) => any;
    dataFormatter?: (statistics: SystemStatistic[]) => Array<Record<string, any>>;
}
