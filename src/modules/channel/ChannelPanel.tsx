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
import styled from '@mui/material/styles/styled';

const ChannelPanelWrapper = styled(Box)(() => {
    return `
        flex-grow: 1;
        flex-shrink: 1;

        &.errored,
        &.loading-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .ka-wrapper,
        .ka-content {
            height: 100%;
        }

        .ka-wrapper {
            width: 100%;
        }
    `;
});

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
        <ChannelPanelWrapper
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
                    : nodes
                        ? <KeepAlive
                            id={tabId}
                            name={tabId}
                            when={() => [true, false]}
                        >{nodes}</KeepAlive>
                        : loading
                            ? <Loading />
                            : errored
                                ? <Exception
                                    imageSrc="/static/images/error.svg"
                                    title={getLocaleText('error.title', { channelId })}
                                    subTitle={getLocaleText('error.subTitle')}
                                />
                                : null
            }
        </ChannelPanelWrapper>
    );
};

export default ChannelPanel;
