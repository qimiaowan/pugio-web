import {
    FC,
    useEffect,
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
import { StoreService } from '@modules/store/store.service';
import SimpleBar from 'simplebar-react';
import _ from 'lodash';

const ClientWorkstation: FC<InjectedComponentProps> = ({
    declarations,
}) => {
    const Tab = declarations.get<FC<TabProps>>(TabComponent);
    const localeService = declarations.get<LocaleService>(LocaleService);
    const storeService = declarations.get<StoreService>(StoreService);

    const [headerWidth, setHeaderWidth] = useState<number>(null);
    const [windowInnerWidth, setWindowInnerWidth] = useState<number>(window.innerWidth);
    const sidebarWidth = storeService.useStore((state) => state.clientSidebarWidth);
    const getLocaleText = localeService.useLocaleContext('pages.client_workstation');

    useEffect(() => {
        if (_.isNumber(sidebarWidth) && _.isNumber(windowInnerWidth)) {
            setHeaderWidth(windowInnerWidth - sidebarWidth);
        }
    }, [sidebarWidth, windowInnerWidth]);

    useEffect(() => {
        const handler = () => {
            setWindowInnerWidth(window.innerWidth);
        };

        window.addEventListener('resize', handler);

        return () => {
            window.removeEventListener('resize', handler);
        };
    }, []);

    return (
        <Box className="page client-workstation-page">
            <Box className="header-container">
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
