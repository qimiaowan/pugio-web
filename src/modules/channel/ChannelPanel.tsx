import {
    FC,
    useEffect,
} from 'react';
import { InjectedComponentProps } from 'khamsa';
import clsx from 'clsx';
import Box, { BoxProps } from '@mui/material/Box';
import { ChannelPanelProps } from '@modules/channel/channel.interface';
import { LoadingComponent } from '@modules/brand/loading.component';
import { ExceptionComponent } from '@modules/brand/exception.component';
import { ExceptionProps } from '@modules/brand/exception.interface';
import { LocaleService } from '@modules/locale/locale.service';
import _ from 'lodash';
import '@modules/channel/channel-panel.component.less';

const ChannelPanel: FC<InjectedComponentProps<ChannelPanelProps>> = ({
    channelId,
    children,
    declarations,
    nodes = null,
    startupTab = false,
    loading = false,
    errored = false,
    className = '',
    channelLoader: loadChannel = _.noop,
    ...props
}) => {
    const localeService = declarations.get<LocaleService>(LocaleService);
    const Loading = declarations.get<FC<BoxProps>>(LoadingComponent);
    const Exception = declarations.get<FC<ExceptionProps>>(ExceptionComponent);

    const getLocaleText = localeService.useLocaleContext('components.channelPanel');

    useEffect(() => {
        if (!startupTab && !nodes) {
            loadChannel(channelId);
        }
    }, [startupTab, nodes]);

    return (
        <Box
            {...props}
            className={clsx('channel-panel', className)}
        >
            {
                startupTab
                    ? children
                    : loading
                        ? <Loading />
                        : (errored || !nodes)
                            ? <Exception
                                imageSrc="/static/images/error.svg"
                                title={getLocaleText('error.title', { channelId })}
                                subTitle={getLocaleText('error.subTitle')}
                            />
                            : nodes
            }
        </Box>
    );
};

export default ChannelPanel;
