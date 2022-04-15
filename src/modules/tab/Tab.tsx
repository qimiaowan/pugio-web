import {
    FC,
    useEffect,
    useState,
} from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { InjectedComponentProps } from 'khamsa';
import { TabProps } from '@modules/tab/tab.interface';
import { LoadingComponent } from '@modules/brand/loading.component';
import { LocaleService } from '@modules/locale/locale.service';
import clsx from 'clsx';
import _ from 'lodash';
import '@modules/tab/tab.component.less';

const Tab: FC<InjectedComponentProps<TabProps>> = ({
    title,
    closable = true,
    slotElement = false,
    active = false,
    avatar = '/static/images/channel_avatar_fallback.svg',
    loading = false,
    declarations,
    errored = false,
    startup = false,
    children,
    className,
    channelId,
    onClose = _.noop,
    onDataLoad = _.noop,
    onTitleChange = _.noop,
    ...props
}) => {
    const localeService = declarations.get<LocaleService>(LocaleService);
    const Loading = declarations.get<FC<BoxProps>>(LoadingComponent);

    const getLocaleText = localeService.useLocaleContext('components.tab');
    const [tabTitle, setTabTitle] = useState<string>('');

    useEffect(() => {
        if (channelId) {
            onDataLoad(channelId);
        }
    }, [channelId]);

    useEffect(() => {
        if (title && channelId) {
            setTabTitle(title);
        } else {
            setTabTitle(getLocaleText('newInstance'));
        }
    }, [getLocaleText, title, channelId]);

    useEffect(() => {
        onTitleChange(title);
    }, [title]);

    return (
        <Box
            title={title}
            className={clsx('tab', {
                active,
                errored,
                startup,
                loading,
                placeholder: slotElement,
            }, className)}
            {...props}
        >
            {
                loading
                    ? <Loading style={{ width: 36 }} />
                    : slotElement
                        ? children
                        : (
                            <Box className="content-wrapper">
                                <Box className="avatar" component="img" src={avatar} />
                                <Typography className="text" noWrap={true}>
                                    {
                                        errored
                                            ? getLocaleText('errored')
                                            : tabTitle
                                    }
                                </Typography>
                            </Box>
                        )
            }
            {
                (closable && !slotElement) && (
                    <IconButton
                        classes={{ root: 'close-icon' }}
                        size="small"
                        onClick={(event) => {
                            event.stopPropagation();
                            onClose();
                        }}
                    >
                        <Icon className="icon-close" />
                    </IconButton>
                )
            }
        </Box>
    );
};

export default Tab;
