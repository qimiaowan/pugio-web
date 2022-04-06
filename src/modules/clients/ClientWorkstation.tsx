import {
    FC,
    useEffect,
    useRef,
    useState,
} from 'react';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import './client-workstation.component.less';
import { InjectedComponentProps } from 'khamsa';
import { TabProps } from '@modules/tab/tab.interface';
import { TabComponent } from '@modules/tab/tab.component';
import { LocaleService } from '@modules/locale/locale.service';
import SimpleBar from 'simplebar-react';
import _ from 'lodash';

const ClientWorkstation: FC<InjectedComponentProps> = ({
    declarations,
}) => {
    const Tab = declarations.get<FC<TabProps>>(TabComponent);
    const localeService = declarations.get<LocaleService>(LocaleService);

    const headerContainerRef = useRef<HTMLDivElement>(null);
    const [headerWidth, setHeaderWidth] = useState<number>(null);
    const getLocaleText = localeService.useLocaleContext('pages.client_workstation');

    useEffect(() => {
        if (headerContainerRef.current) {
            const initialWidth = headerContainerRef.current.clientWidth;
            setHeaderWidth(initialWidth);
        }
    }, [headerContainerRef]);

    return (
        <Box className="page client-workstation-page">
            <Box className="header-container" ref={headerContainerRef}>
                <Box className="controls"></Box>
                <Box className="tabs" style={{ width: headerWidth }}>
                    {
                        _.isNumber(headerWidth) && (
                            <SimpleBar
                                className="tabs-wrapper"
                                autoHide={true}
                                style={{ maxWidth: headerWidth - 40 }}
                            >
                                <Tab
                                    closable={false}
                                    avatar="/static/images/all_channels.svg"
                                    title={getLocaleText('all_channels')}
                                />
                                <Tab placeholder={true} />
                            </SimpleBar>
                        )
                    }
                    <Box className="add-button-wrapper">
                        <IconButton>
                            <Icon className="icon-plus" />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ClientWorkstation;
