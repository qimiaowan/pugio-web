import { FC } from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { InjectedComponentProps } from 'khamsa';
import { TabProps } from '@modules/tab/tab.interface';
import { LoadingComponent } from '@modules/brand/loading.component';
import clsx from 'clsx';
import '@modules/tab/tab.component.less';

const Tab: FC<InjectedComponentProps<TabProps>> = ({
    title,
    closable = true,
    slotElement = false,
    active = false,
    avatar = '/static/images/channel_avatar_fallback.svg',
    loading = false,
    declarations,
    ...props
}) => {
    const Loading = declarations.get<FC<BoxProps>>(LoadingComponent);

    return (
        <Box
            title={title}
            className={clsx('tab', {
                active,
                placeholder: slotElement,
            })}
            {...props}
        >
            {
                loading
                    ? <Loading style={{ width: 36 }} />
                    : slotElement
                        ? null
                        : (
                            <>
                                <Box className="content-wrapper">
                                    <Box className="avatar" component="img" src={avatar} />
                                    <Typography className="text" noWrap={true}>{title}</Typography>
                                </Box>
                                {
                                    closable && (
                                        <IconButton classes={{ root: 'close-icon' }} size="small">
                                            <Icon className="icon-close" />
                                        </IconButton>
                                    )
                                }
                            </>
                        )
            }
        </Box>
    );
};

export default Tab;
