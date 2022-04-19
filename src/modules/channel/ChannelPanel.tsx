import { FC } from 'react';
import { InjectedComponentProps } from 'khamsa';
import clsx from 'clsx';
import Box, { BoxProps } from '@mui/material/Box';
import { ChannelPanelProps } from '@modules/channel/channel.interface';
import { LoadingComponent } from '@modules/brand/loading.component';
import { ExceptionComponent } from '@modules/brand/exception.component';
import { ExceptionProps } from '@modules/brand/exception.interface';
import { LocaleService } from '@modules/locale/locale.service';
import { KeepAlive } from 'react-activation';
import '@modules/channel/channel-panel.component.less';

const ChannelPanel: FC<InjectedComponentProps<ChannelPanelProps>> = ({
    children,
    declarations,
    className = '',
    channelTab = {},
    tabId,
    ...props
}) => {
    const {
        errored,
        loading,
        channelId,
        nodes,
    } = channelTab;

    const localeService = declarations.get<LocaleService>(LocaleService);
    const Loading = declarations.get<FC<BoxProps>>(LoadingComponent);
    const Exception = declarations.get<FC<ExceptionProps>>(ExceptionComponent);

    const getLocaleText = localeService.useLocaleContext('components.channelPanel');

    return (
        <Box
            {...props}
            className={clsx(
                'channel-panel',
                {
                    errored,
                    'loading-wrapper': loading,
                },
                className,
            )}
        >
            {
                !channelId
                    ? children
                    : loading
                        ? <Loading />
                        : (errored || !nodes)
                            ? <Exception
                                imageSrc="/static/images/error.svg"
                                title={getLocaleText('error.title', { channelId })}
                                subTitle={getLocaleText('error.subTitle')}
                            />
                            : <KeepAlive
                                id={tabId}
                                name={tabId}
                                when={() => [true, false]}
                            >{nodes}</KeepAlive>
            }
        </Box>
    );
};

export default ChannelPanel;
